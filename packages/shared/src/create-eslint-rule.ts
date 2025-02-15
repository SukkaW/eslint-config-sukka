import type { TSESLint, ParserServices, ParserServicesWithTypeInformation } from '@typescript-eslint/utils';

export type { RuleContext } from '@typescript-eslint/utils/ts-eslint';

const BASE_URL = 'https://eslint-plugin.skk.moe/src/rules/';

interface Metadata<MessageIDs extends string, PluginDocs = unknown> extends TSESLint.RuleMetaData<MessageIDs, PluginDocs & { recommended?: TSESLint.RuleRecommendation
}> {
  hidden?: boolean
}

export interface RuleModule<
  TResolvedOptions,
  TOptions extends readonly unknown[],
  TMessageIDs extends string,
  TMetaDocs = unknown
> {
  readonly name: string,
  readonly meta: Metadata<TMessageIDs, TMetaDocs>,
  resolveOptions?(this: void, ...options: TOptions): TResolvedOptions,
  create(this: void, context: Readonly<TSESLint.RuleContext<TMessageIDs, TOptions>>, options: TResolvedOptions): TSESLint.RuleListener
}

export interface ExportedRuleModule<
  TOptions extends readonly unknown[] = unknown[],
  TMessageIDs extends string = string
> {
  readonly name: string,
  readonly meta: Metadata<TMessageIDs>,
  create(context: Readonly<TSESLint.RuleContext<TMessageIDs, TOptions>>): TSESLint.RuleListener
}

export function createRule<
  TResolvedOptions,
  TOptions extends unknown[],
  TMessageIDs extends string,
  PluginDocs = unknown
>({ name, meta, create, resolveOptions }: RuleModule<TResolvedOptions, TOptions, TMessageIDs, PluginDocs>): ExportedRuleModule<TOptions, TMessageIDs> {
  if (meta.docs) {
    meta.docs.url ??= new URL(name, BASE_URL).toString();
  }
  return {
    name,
    meta,
    create(context) {
      const options = resolveOptions?.(...context.options) ?? (context.options[0] as TResolvedOptions);
      const listener = Object.entries(create(context, options));
      return Object.fromEntries(listener.filter((pair) => pair[1])) as TSESLint.RuleListener;
    }
  } satisfies ExportedRuleModule<TOptions, TMessageIDs>;
}

export function isParserWithTypeInformation(
  parserServices: Partial<ParserServices> | undefined
): parserServices is ParserServicesWithTypeInformation {
  return !!parserServices?.program;
}

export function ensureParserWithTypeInformation(
  parserServices: Partial<ParserServices> | undefined
): asserts parserServices is ParserServicesWithTypeInformation {
  if (!parserServices?.program) {
    throw new Error('see https://typescript-eslint.io/docs/linting/type-linting');
  }
}
