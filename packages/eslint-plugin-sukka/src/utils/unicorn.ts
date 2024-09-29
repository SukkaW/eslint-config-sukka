import type { RuleContext, RuleModule } from '@eslint-sukka/shared';
import type { TSESLint } from '@typescript-eslint/utils';

// @ts-expect-error - eslint-plugin-unicorn does not have types
import getDocumentationUrl from 'eslint-plugin-unicorn/rules/utils/get-documentation-url.js';

export function loadUnicorn<TMessageIDs extends string, TOptions extends unknown[]>(rule: RuleModule<TOptions, TOptions, TMessageIDs>, ruleId: string): RuleModule<TOptions, TOptions, TMessageIDs> {
  return {
    ...rule,
    meta: {
      // If there is are, options add `[]` so ESLint can validate that no data is passed to the rule.
      // https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/blob/master/docs/rules/require-meta-schema.md
      // @ts-expect-error -- unicorn might not provide schema
      schema: [],
      ...rule.meta,
      docs: {
        description: '',
        ...rule.meta.docs,
        url: getDocumentationUrl(ruleId)
      }
    },

    create: reportProblems<TMessageIDs, TOptions>(rule.create)
  };
}

const isIterable = (object: object | null | undefined): object is Iterable<unknown> => !!object && Symbol.iterator in object;

class FixAbortError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'FixAbortError';
  }
}

const fixOptions = {
  abort() {
    throw new FixAbortError('Fix aborted.');
  }
};

function wrapFixFunction(fix: TSESLint.ReportFixFunction): TSESLint.ReportFixFunction {
  return (fixer) => {
    // @ts-expect-error -- fixOptions is unicorn specific
    const result = fix(fixer, fixOptions);

    if (isIterable(result)) {
      try {
        return [...result];
      } catch (error) {
        if (error instanceof FixAbortError) {
          return null;
        }

        /* c8 ignore next */
        throw error;
      }
    }

    return result;
  };
}

type DeepWritable<T> = { -readonly [K in keyof T]: DeepWritable<T[K]> };

function reportListenerProblems<TMessageIDs extends string, TOptions extends unknown[]>(
  problems:
    | DeepWritable<TSESLint.ReportDescriptor<TMessageIDs>>
    | Iterable<DeepWritable<TSESLint.ReportDescriptor<TMessageIDs>> | null | undefined>
    | null | undefined | void,
  context: Readonly<RuleContext<TMessageIDs, TOptions>>
) {
  if (!problems) {
    return;
  }

  if (!isIterable(problems)) {
    problems = [problems];
  }

  for (const problem of problems) {
    if (!problem) {
      continue;
    }

    if (problem.fix) {
      problem.fix = wrapFixFunction(problem.fix as TSESLint.ReportFixFunction);
    }

    if (isIterable(problem.suggest)) {
      for (const suggest of problem.suggest) {
        if ('fix' in suggest && typeof suggest.fix === 'function') {
          suggest.fix = wrapFixFunction(suggest.fix as TSESLint.ReportFixFunction);
        }

        suggest.data = { ...problem.data, ...suggest.data };
      }
    }

    context.report(problem as TSESLint.ReportDescriptor<TMessageIDs>);
  }
}

// `checkVueTemplate` function will wrap `create` function, there is no need to wrap twice
// const wrappedFunctions = new WeakSet();
function reportProblems<TMessageIDs extends string, TOptions extends unknown[]>(create: RuleModule<TOptions | undefined, TOptions, TMessageIDs>['create'], options?: TOptions) {
  // if (wrappedFunctions.has(create)) {
  //   return create;
  // }

  // wrappedFunctions.add(wrapped);

  return (context: Readonly<RuleContext<TMessageIDs, TOptions>>) => {
    const listeners: {
      [K in keyof TSESLint.RuleListener]: Array<TSESLint.RuleListener[K]>;
    } = {};
    const addListener = (selector: string, listener: TSESLint.RuleFunction) => {
      listeners[selector] ??= [];
      listeners[selector].push(listener);
    };

    const contextProxy = new Proxy(context, {
      get(target, property, receiver) {
        if (property === 'on') {
          return (selectorOrSelectors: string | string[], listener: TSESLint.RuleFunction) => {
            const selectors = Array.isArray(selectorOrSelectors) ? selectorOrSelectors : [selectorOrSelectors];
            for (const selector of selectors) {
              addListener(selector, listener);
            }
          };
        }

        if (property === 'onExit') {
          return (selectorOrSelectors: string | string[], listener: TSESLint.RuleFunction) => {
            const selectors = Array.isArray(selectorOrSelectors) ? selectorOrSelectors : [selectorOrSelectors];
            for (const selector of selectors) {
              addListener(`${selector}:exit`, listener);
            }
          };
        }

        return Reflect.get(target, property, receiver);
      }
    });

    for (const [selector, listener] of Object.entries(create(contextProxy, options) || {})) {
      if (listener) {
        addListener(selector, listener);
      }
    }

    return Object.fromEntries(
      Object.entries(listeners)
        .map(([selector, listeners]) => [
          selector,
          // Listener arguments can be `codePath, node` or `node`
          (...listenerArguments: unknown[]) => {
            for (const listener of listeners) {
              if (listener) {
                // @ts-expect-error -- bad types
                reportListenerProblems<TMessageIDs, TOptions>(listener(...listenerArguments), context);
              }
            }
          }
        ])
    );
  };
}
