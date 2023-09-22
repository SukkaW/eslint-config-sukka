import { rules } from '@eslint-sukka/shared';
import { typescript } from './typescript';

/**
 * This is a compatibility ruleset that:
 * - disables rules from eslint:recommended which are already handled by TypeScript.
 * - enables rules that make sense due to TS's typechecking / transpilation.
 */
import { overrides as typescriptESLintBuiltinOverrides } from './generated/typescript-eslint-builtin-overrides';

export default {
  plugins: ['@typescript-eslint', '@fluffyfox'],
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:i/recommended',
    'plugin:i/typescript'
  ],
  overrides: typescriptESLintBuiltinOverrides,
  rules: {
    ...rules.best_practices,
    ...rules.errors,
    ...rules.es6,
    ...rules.style,
    ...rules.variables,
    ...typescript
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts']
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts', '.d.ts']
      },
      typescript: {
        alwaysTryTypes: true
      }
    }
  }
};
