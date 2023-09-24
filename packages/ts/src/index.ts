import { constants } from '@eslint-sukka/shared';

import { typescript as typescriptConfig } from './modules/typescript';
import { sukkaTypeScript } from './modules/sukka';
import { generated_overrides } from './modules/generated_overrides';

import ts_eslint_plugin from '@typescript-eslint/eslint-plugin';
import es_eslint_parser from '@typescript-eslint/parser';
// @ts-expect-error -- no types
import eslint_plugin_i from 'eslint-plugin-i';

import type { FlatESLintConfigItem } from 'eslint-define-config';

export interface OptionsTypeScript {
  tsconfigPath: string | string[],
  tsconfigRootDir?: string,
  componentExtentions?: string[]
}

const typeScriptExtensions = ['.ts', '.cts', '.mts', '.tsx', '.d.ts'];
const javaScriptExtensions = ['.js', '.jsx', '.mjs', '.cjs'];
const allExtensions = [...typeScriptExtensions, ...javaScriptExtensions];

export const typescript = (options: OptionsTypeScript): FlatESLintConfigItem[] => {
  const { tsconfigPath, tsconfigRootDir = process.cwd(), componentExtentions = [] } = options;

  return [
    {
      files: [
        constants.GLOB_TS,
        constants.GLOB_TSX,
        ...componentExtentions.map(ext => `**/*.${ext}`)
      ],
      plugins: {
        ...typescriptConfig.plugins,
        ...sukkaTypeScript.plugins,
        ...generated_overrides.plugins,
        '@typescript-eslint': ts_eslint_plugin as any,
        i: eslint_plugin_i,
        import: eslint_plugin_i // legacy
      },
      // extends: [
      //   'plugin:i/recommended',
      //   'plugin:i/typescript'
      // ],
      languageOptions: {
        parser: es_eslint_parser,
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
        'import/resolver': {
          node: {
            extensions: allExtensions
          },
          typescript: {
            alwaysTryTypes: true
          }
        },
        'import/parsers': {
          // TODO: remove this line once eslint-plugin-import #2556 is fixed
          espree: javaScriptExtensions,
          '@typescript-eslint/parser': typeScriptExtensions
        }
      },
      rules: {
        // overwritten eslint:recommended
        /**
         * This is a compatibility ruleset that:
         * - disables rules from eslint:recommended which are already handled by TypeScript.
         * - enables rules that make sense due to TS's typechecking / transpilation.
         */
        ...ts_eslint_plugin.configs['eslint-recommended'].overrides![0].rules,
        // plugin:@typescript-eslint/recommended
        ...ts_eslint_plugin.configs.base.rules,
        ...ts_eslint_plugin.configs.recommended.rules, // plugin:@typescript-eslint/recommended
        // plugin:@typescript-eslint/recommended-type-checked
        ...ts_eslint_plugin.configs['recommended-type-checked'].rules,
        // plugin:@typescript-eslint/stylistic
        ...ts_eslint_plugin.configs.stylistic.rules,
        // plugin:@typescript-eslint/stylistic-type-checked
        ...ts_eslint_plugin.configs['stylistic-type-checked'].rules,
        // plugin:i/recommended
        ...eslint_plugin_i.configs.recommended.rules,
        // plugin:i/typescript
        ...eslint_plugin_i.configs.typescript.rules,

        ...typescriptConfig.rules,
        ...sukkaTypeScript.rules,
        ...generated_overrides.rules
      }
    },
    {
      files: ['**/*.d.ts'],
      plugins: {
        i: eslint_plugin_i,
        import: eslint_plugin_i // legacy
      },
      rules: {
        'import/no-duplicates': 'off'
        // 'unused-imports/no-unused-vars': 'off'
      }
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      rules: {
        'no-unused-expressions': 'off'
      }
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      plugins: {
        '@typescript-eslint': ts_eslint_plugin as any
      },
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ];
};
