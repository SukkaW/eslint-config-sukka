import path from 'node:path';
import { RuleTester } from '@typescript-eslint/rule-tester';
import type { InvalidTestCase, ValidTestCase } from '@typescript-eslint/rule-tester';

import type { ExportedRuleModule } from '@eslint-sukka/shared';
import { afterAll, describe, it } from 'vitest';

// import { globals } from '@eslint-sukka/shared';

RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.itSkip = it.skip;
RuleTester.describe = describe;
RuleTester.describeSkip = describe.skip;

const tester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
      project: 'tsconfig.json',
      projectService: true,
      tsconfigRootDir: path.join(__dirname, '..', 'tests', 'fixtures'),
      warnOnUnsupportedTypeScriptVersion: false
    }
  }
});

type TestCaseGenerator<T, R = T> = (cast: (input: T) => T) => Generator<R>;

interface RunOptions<TOptions extends readonly unknown[], TMessageIds extends string> {
  module: ExportedRuleModule<TOptions, TMessageIds>,
  valid?: TestCaseGenerator<ValidTestCase<TOptions>, string | ValidTestCase<TOptions>>,
  invalid?: TestCaseGenerator<InvalidTestCase<TMessageIds, TOptions>>
}

export function runTest<TOptions extends readonly unknown[], TMessageIds extends string>(
  { module: mod, valid, invalid }: RunOptions<TOptions, TMessageIds>
) {
  tester.run(mod.name, mod as any, {
    valid: Array.from(valid?.(identity) ?? []).flat(),
    invalid: Array.from(invalid?.(identity) ?? []).flat()
  });
}

function identity<T>(input: T): T {
  return input;
}
