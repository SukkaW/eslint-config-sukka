import path from 'node:path';
import { RuleTester } from '@typescript-eslint/rule-tester';
import type { InvalidTestCase, ValidTestCase } from '@typescript-eslint/rule-tester';

import type { ExportedRuleModule } from '@eslint-sukka/shared';
import { after, describe, it } from 'mocha';
import type { TSESLint } from '@typescript-eslint/utils';
import { identity } from 'foxts/identity';

// import { globals } from '@eslint-sukka/shared';

RuleTester.afterAll = after;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.itSkip = it.skip;
RuleTester.describe = describe;
RuleTester.describeSkip = describe.skip;

const $tester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
      project: 'tsconfig.json',
      projectService: true,
      tsconfigRootDir: path.join(__dirname, '..', '..', 'tests', 'fixtures'),
      warnOnUnsupportedTypeScriptVersion: false
    }
  },
  linterOptions: {
    reportUnusedDisableDirectives: false
  }
});

type TestCaseGenerator<T, R = T> = ((cast: (input: T) => T) => Generator<R>) | (readonly R[]);

interface RunOptions<TOptions extends readonly unknown[], TMessageIds extends string> {
  module: ExportedRuleModule<TOptions, TMessageIds>,
  valid?: TestCaseGenerator<ValidTestCase<TOptions>, string | ValidTestCase<TOptions>>,
  invalid?: TestCaseGenerator<InvalidTestCase<TMessageIds, TOptions>>
}

export function runTest<TOptions extends readonly unknown[], TMessageIds extends string>(
  { module: mod, valid, invalid }: RunOptions<TOptions, TMessageIds>,
  extraRules?: Record<string, TSESLint.AnyRuleModule>
) {
  const $valid = typeof valid === 'function'
    ? Array.from(valid(identity))
    : (valid ?? []);
  const $invalid = typeof invalid === 'function'
    ? Array.from(invalid(identity))
    : (invalid ?? []);

  const tester = extraRules
    ? (() => {
      const tester = new RuleTester({
        languageOptions: {
          parserOptions: {
            ecmaFeatures: { jsx: true },
            project: 'tsconfig.json',
            tsconfigRootDir: path.join(__dirname, '..', '..', 'tests', 'fixtures'),
            warnOnUnsupportedTypeScriptVersion: false
          }
        },
        linterOptions: {
          reportUnusedDisableDirectives: false
        }
      });

      Object.entries(extraRules).forEach(([name, rule]) => tester.defineRule(name, rule));

      return tester;
    })()
    : $tester;

  // eslint-disable-next-line sukka/type/no-force-cast-via-top-type -- mismatch between me and typescript-eslint
  tester.run(mod.name, mod as unknown as TSESLint.RuleModule<TMessageIds, TOptions>, {
    valid: $valid.flat().map((item, index) => {
      if (typeof item === 'string') {
        return item;
      }

      return {
        ...item,
        name: `${item.name || 'valid'} #${index}`
      };
    }),
    invalid: $invalid.flat().map((item, index) => ({
      ...item,
      name: `${item.name || 'invalid'} #${index}`
    }))
  });
}

runTest.skip = <TOptions extends readonly unknown[], TMessageIds extends string>(
  _args: RunOptions<TOptions, TMessageIds>
) => {
  // noop
};
