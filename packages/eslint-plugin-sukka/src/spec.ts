import path from 'path';
import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import type { InvalidTestCase, ValidTestCase } from '@typescript-eslint/utils/ts-eslint';
import { it } from 'vitest';
import type { ExportedRuleModule } from './utils/rule';

const tester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    tsconfigRootDir: path.join(__dirname, '..', 'tests', 'fixtures'),
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: { jsx: true }
  },
  env: {
    browser: true
  }
});

type TestCaseGenerator<T, R = T> = (cast: (input: T) => T) => Generator<R>

interface RunOptions<TOptions extends readonly unknown[], TMessageIds extends string> {
  module: ExportedRuleModule<TOptions, TMessageIds>,
  valid?: TestCaseGenerator<ValidTestCase<TOptions>, string | ValidTestCase<TOptions>>,
  invalid?: TestCaseGenerator<InvalidTestCase<TMessageIds, TOptions>>
}

export function runTest<TOptions extends readonly unknown[], TMessageIds extends string>(
  options: RunOptions<TOptions, TMessageIds>
) {
  const { module, valid, invalid } = options;
  it(module.name, () => {
    tester.run(module.name, module as any, {
      valid: [...(valid?.(identifier) ?? [])].flat(),
      invalid: [...(invalid?.(identifier) ?? [])].flat()
    });
  });
}

function identifier<T>(input: T): T {
  return input;
}
