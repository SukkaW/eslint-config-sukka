import { constants, memo } from '@eslint-sukka/shared';

import { typescript as typescriptConfig } from './modules/typescript';
import { sukka_typeScript } from './modules/sukka';
import { generated_overrides } from './modules/generated_overrides';

import eslint_plugin_import_x from 'eslint-plugin-import-x';

import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import { configs as ts_eslint_configs } from 'typescript-eslint';

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
      name: '@eslint-sukka/ts base',
      files: [
        constants.GLOB_TS,
        constants.GLOB_TSX,
        ...componentExtentions.map(ext => `**/*.${ext}`)
      ],
      plugins: {
        ...typescriptConfig.plugins,
        ...sukka_typeScript.plugins,
        ...generated_overrides.plugins,
        ...ts_eslint_configs.base.plugins,
        'import-x': memo(eslint_plugin_import_x, 'eslint-plugin-import-x') as any
      },
      // extends: [
      //   'plugin:i/recommended',
      //   'plugin:i/typescript'
      // ],
      languageOptions: {
        parser: ts_eslint_configs.base.languageOptions!.parser as any,
        sourceType: 'module',
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

        // plugin:@typescript-eslint/recommended
        ...ts_eslint_configs.base.rules,
        // plugin:@typescript-eslint/recommended-type-checked
        ...ts_eslint_configs.recommendedTypeChecked.reduce<typeof ts_eslint_configs.base.rules>(
          (acc, curr) => ({ ...acc, ...curr.rules }),
          {}
        ),
        // plugin:@typescript-eslint/stylistic-type-checked
        ...ts_eslint_configs.stylisticTypeChecked.reduce<typeof ts_eslint_configs.base.rules>(
          (acc, curr) => ({ ...acc, ...curr.rules }),
          {}
        ),
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
      name: '@eslint-sukka/ts dts',
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
      name: '@eslint-sukka/ts jest/mocha',
      files: ['**/*.{test,spec}.ts?(x)'],
      rules: {
        'no-unused-expressions': 'off'
      }
    },
    {
      name: '@eslint-sukka/ts commonjs',
      files: ['**/*.js', '**/*.cjs'],
      plugins: ts_eslint_configs.base.plugins as any,
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ];
};
