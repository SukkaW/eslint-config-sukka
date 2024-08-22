import path from 'path';
import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import type { InvalidTestCase, ValidTestCase } from '@typescript-eslint/rule-tester';
import type { ExportedRuleModule } from '@eslint-sukka/shared';
// import { afterAll, describe, it } from 'vitest';

import { globals } from '@eslint-sukka/shared';
import { it } from 'vitest';

// RuleTester.afterAll = afterAll;
// RuleTester.it = it;
// RuleTester.itOnly = it.only;
// RuleTester.itSkip = it.skip;
// RuleTester.describe = describe;
// RuleTester.describeSkip = describe.skip;

const tester = new RuleTester({
  languageOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    globals: {
      ...globals.browser
    },
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      tsconfigRootDir: path.join(__dirname, '..', 'tests', 'fixtures'),
      project: true,
      ecmaFeatures: { jsx: true }
    }
  }

  // https://github.com/typescript-eslint/typescript-eslint/issues/8211
  // TODO: remove this any once ts-eslint v7 has implemented type for the ESLint v9 FlatRuleTester
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
} as any);

type TestCaseGenerator<T, R = T> = (cast: (input: T) => T) => Generator<R>;

interface RunOptions<TOptions extends readonly unknown[], TMessageIds extends string> {
  module: ExportedRuleModule<TOptions, TMessageIds>,
  valid?: TestCaseGenerator<ValidTestCase<TOptions>, string | ValidTestCase<TOptions>>,
  invalid?: TestCaseGenerator<InvalidTestCase<TMessageIds, TOptions>>
}

export function runTest<TOptions extends readonly unknown[], TMessageIds extends string>(
  options: RunOptions<TOptions, TMessageIds>
) {
  const { module: mod, valid, invalid } = options;
  it(mod.name, () => {
    tester.run(mod.name, mod as any, {
      valid: Array.from(valid?.(identifier) ?? []).flat(),
      invalid: Array.from(invalid?.(identifier) ?? []).flat()
    });
  });
}

function identifier<T>(input: T): T {
  return input;
}
