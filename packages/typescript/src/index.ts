import { best_practices, errors, es6, style, variables, sukka, constants } from '@eslint-sukka/shared';
import { typescript as typescriptConfig } from './typescript';
import { sukkaTypeScript } from './sukka';

// @ts-expect-error -- no types
import eslintJs from '@eslint/js';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
// @ts-expect-error -- no types
import eslintPluginI from 'eslint-plugin-i';

import type { FlatESLintConfigItem } from 'eslint-define-config';

export interface OptionsTypeScript {
  tsconfigPath: string | string[]
  tsconfigRootDir?: string
  componentExtentions?: string[]
}

const typeScriptExtensions = ['.ts', '.cts', '.mts', '.tsx', '.d.ts'];
const allExtensions = ['.js', '.jsx', '.mjs', '.cjs', ...typeScriptExtensions];

export const typescript = (options: OptionsTypeScript): FlatESLintConfigItem[] => {
  const { tsconfigPath, tsconfigRootDir = process.cwd(), componentExtentions = [] } = options

  return [
    eslintJs.configs.recommended,
    {
      files: [
        constants.GLOB_TS,
        constants.GLOB_TSX,
        ...componentExtentions.map(ext => `**/*.${ext}`),
      ],
      plugins: {
        ...best_practices.plugins,
        ...errors.plugins,
        ...es6.plugins,
        ...style.plugins,
        ...variables.plugins,
        ...sukka.plugins,
        ...typescriptConfig.plugins,
        ...sukkaTypeScript.plugins,
        '@typescript-eslint': tsEslintPlugin as any,
        i: eslintPluginI,
        import: eslintPluginI, // legacy
      },
      // extends: [
      //   'plugin:i/recommended',
      //   'plugin:i/typescript'
      // ],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          sourceType: 'module',
          ecmaVersion: 'latest',
          project: tsconfigPath,
          tsconfigRootDir
        }
      },
      settings: {
        'import/extensions': allExtensions,
        'import/external-module-folders': ['node_modules', 'node_modules/@types'],
        'import/parsers': {
          '@typescript-eslint/parser': typeScriptExtensions,
        },
        'import/resolver': {
          node: {
            extensions: allExtensions,
          },
          typescript: {
            alwaysTryTypes: true
          }
        }
      },
      rules: {
        ...best_practices.rules,
        ...errors.rules,
        ...es6.rules,
        ...style.rules,
        ...variables.rules,
        ...sukka.rules,
        ...typescriptConfig.rules,
        ...sukkaTypeScript.rules,

        // overwritten eslint:recommended
        /**
         * This is a compatibility ruleset that:
         * - disables rules from eslint:recommended which are already handled by TypeScript.
         * - enables rules that make sense due to TS's typechecking / transpilation.
         */
        ...tsEslintPlugin.configs['eslint-recommended'].overrides![0].rules,
        // plugin:@typescript-eslint/recommended
        ...tsEslintPlugin.configs.base.rules,
        ...tsEslintPlugin.configs.recommended.rules, // plugin:@typescript-eslint/recommended
        // plugin:@typescript-eslint/recommended-type-checked
        ...tsEslintPlugin.configs['recommended-type-checked'].rules,
        // plugin:@typescript-eslint/stylistic
        ...tsEslintPlugin.configs.stylistic.rules,
        // plugin:@typescript-eslint/stylistic-type-checked
        ...tsEslintPlugin.configs['stylistic-type-checked'].rules,
        // plugin:i/recommended
        ...eslintPluginI.configs.recommended.rules,
        // plugin:i/typescript
        ...eslintPluginI.configs.typescript.rules,
      }
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/no-duplicates': 'off',
        // 'unused-imports/no-unused-vars': 'off'
      },
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    }]
};
