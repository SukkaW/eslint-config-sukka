import { best_practices, errors, es6, style, variables, sukka } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from 'eslint-define-config';
import eslintPluginSukka from 'eslint-plugin-sukka';

// @ts-expect-error -- no types
import eslintJs from '@eslint/js';
// @ts-expect-error -- no types
import eslintPluginI from 'eslint-plugin-i';
// @ts-expect-error -- no types
import eslintPluginN from 'eslint-plugin-n';

import globals from 'globals';

const eslintPluginNRecommendedConfig = eslintPluginN.configs['flat/recommended'];
const allExtensions = ['.js', '.jsx', '.mjs', '.cjs'];
export const node = (): FlatESLintConfigItem[] => {
  return [
    eslintPluginNRecommendedConfig,
    {
      plugins: {
        ...best_practices.plugins,
        ...errors.plugins,
        ...es6.plugins,
        ...style.plugins,
        ...variables.plugins,
        ...sukka.plugins,
        n: eslintPluginN,
        i: eslintPluginI,
        sukka: eslintPluginSukka
      },
      languageOptions: {
        ...eslintPluginNRecommendedConfig.languageOptions,
        globals: {
          ...globals.es2015,
          ...globals.es2017,
          ...globals.es2020,
          ...globals.es2021,
        }
      },
      settings: {
        'import/extensions': allExtensions,
        'import/external-module-folders': ['node_modules', 'node_modules/@types'],
        'import/resolver': {
          node: {
            extensions: allExtensions,
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

        // eslint:recommended
        ...eslintJs.configs.recommended.rules,
        // plugin:i/recommended
        ...eslintPluginI.configs.recommended.rules,

        // Strict Mode
        strict: 'warn',

        // enforces error handling in callbacks (node environment)
        'handle-callback-err': 'off',

        // disallow use of the Buffer() constructor
        // https://eslint.org/docs/rules/no-buffer-constructor
        'no-buffer-constructor': 'error',

        // disallow use of new operator with the require function
        'no-new-require': 'error',

        // disallow string concatenation with __dirname and __filename
        // https://eslint.org/docs/rules/no-path-concat
        'no-path-concat': 'error',

        // disallow use of process.env
        'no-process-env': 'off',

        // disallow process.exit()
        'no-process-exit': 'off',

        // restrict usage of specified node modules
        'no-restricted-modules': 'off',

        // disallow use of synchronous methods (off by default)
        'no-sync': 'off',

        // I still use them
        'n/no-deprecated-api': ['error', {
          ignoreModuleItems: ['url.parse', 'url.resolve']
        }],

        // eslint-plugin-i & eslint-plugin-unused-import will get me covered
        'n/no-missing-import': 'off',
        'n/no-missing-require': 'off',
        // replaced by i/no-extraneous-dependencies
        'n/no-extraneous-import': 'off',
        'n/no-extraneous-require': 'off',

        'sukka/unicorn/no-new-buffer': 'error' // NodeJS
      }
    }];
}
