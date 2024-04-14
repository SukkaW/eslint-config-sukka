import { constants, memo } from '@eslint-sukka/shared';

import { typescript as typescriptConfig } from './modules/typescript';
import { sukka_typeScript } from './modules/sukka';
import { generated_overrides } from './modules/generated_overrides';

import ts_eslint_plugin from '@typescript-eslint/eslint-plugin';
import ts_eslint_parser from '@typescript-eslint/parser';
import eslint_plugin_import_x from 'eslint-plugin-import-x';

import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

export interface OptionsTypeScript {
  tsconfigPath?: string | string[] | true,
  tsconfigRootDir?: string,
  componentExtentions?: string[]
}

const javaScriptExtensions = ['.js', '.jsx', '.mjs', '.cjs'];
const allExtensions = ['.ts', '.cts', '.mts', '.tsx', '.d.ts', ...javaScriptExtensions];
// Omit `.d.ts` because 1) TypeScript compilation already confirms that
// types are resolved, and 2) it would mask an unresolved
// `.ts`/`.tsx`/`.js`/`.jsx` implementation.
const importResolverExtensions = ['.ts', '.cts', '.mts', '.tsx', ...javaScriptExtensions];

export const typescript = (options: OptionsTypeScript = {}): FlatESLintConfigItem[] => {
  const { tsconfigPath = true, tsconfigRootDir = process.cwd(), componentExtentions = [] } = options;

  return [
    {
      files: [
        constants.GLOB_TS,
        constants.GLOB_TSX,
        ...componentExtentions.map(ext => `**/*.${ext}`)
      ],
      plugins: {
        ...typescriptConfig.plugins,
        ...sukka_typeScript.plugins,
        ...generated_overrides.plugins,
        '@typescript-eslint': ts_eslint_plugin as any,
        'import-x': memo(eslint_plugin_import_x, 'eslint-plugin-import-x') as any
      },
      // extends: [
      //   'plugin:i/recommended',
      //   'plugin:i/typescript'
      // ],
      languageOptions: {
        parser: ts_eslint_parser as any,
        parserOptions: {
          sourceType: 'module',
          ecmaVersion: 'latest',
          project: tsconfigPath,
          tsconfigRootDir,
          ecmaFeatures: {
            jsx: true
          },
          // for @typescript/eslint-parser
          jsxPragma: undefined,
          warnOnUnsupportedTypeScriptVersion: true
        }
      },
      settings: {
        'import-x/extensions': allExtensions,
        'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
        'import-x/resolver': {
          node: {
            extensions: importResolverExtensions
          },
          'ts-bundled': {
            alwaysTryTypes: true,
            ...(tsconfigPath === true ? {} : {
              project: tsconfigPath
            })
          }
        },
        'import-x/parsers': {
          // TODO: remove this line once eslint-plugin-import #2556 is fixed
          espree: javaScriptExtensions,
          '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx', '.d.ts']
        }
      },
      rules: {
        // overwritten eslint:recommended
        /**
         * This is a compatibility ruleset that:
         * - disables rules from eslint:recommended which are already handled by TypeScript.
         * - enables rules that make sense due to TS's typechecking / transpilation.
         */
        ...ts_eslint_plugin.configs['eslint-recommended'].overrides?.map((override) => override.rules).reduce((prev, curr) => ({ ...prev, ...curr }), {}),
        // plugin:@typescript-eslint/recommended
        ...ts_eslint_plugin.configs.base.rules,
        ...ts_eslint_plugin.configs.recommended.rules, // plugin:@typescript-eslint/recommended
        // plugin:@typescript-eslint/recommended-type-checked
        ...ts_eslint_plugin.configs['recommended-type-checked'].rules,
        // plugin:@typescript-eslint/stylistic
        ...ts_eslint_plugin.configs.stylistic.rules,
        // plugin:@typescript-eslint/stylistic-type-checked
        ...ts_eslint_plugin.configs['stylistic-type-checked'].rules,
        // plugin:i/typescript
        ...eslint_plugin_import_x.configs.typescript.rules,

        ...generated_overrides.rules,

        ...typescriptConfig.rules,
        ...sukka_typeScript.rules,

        // replaced by unused-imports/no-unused-imports
        '@typescript-eslint/no-unused-vars': 'off'
      }
    },
    {
      files: ['**/*.d.ts'],
      plugins: {
        'import-x': memo(eslint_plugin_import_x, 'eslint-plugin-import-x') as any
      },
      rules: {
        'import-x/no-duplicates': 'off',
        'unused-imports/no-unused-vars': 'off'
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
