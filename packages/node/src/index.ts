import type { FlatESLintConfigItem } from 'eslint-define-config';

import { getPackageJson } from '@eslint-sukka/shared';

import eslint_plugin_sukka from 'eslint-plugin-sukka';
// @ts-expect-error -- no types
import eslint_plugin_n from 'eslint-plugin-n';

import globals from 'globals';

export interface OptionsNode {
  strict?: boolean,
  module?: boolean,
  files?: FlatESLintConfigItem['files']
}

export const node = (options: OptionsNode = {}): FlatESLintConfigItem[] => {
  const isModule = options.module ?? (getPackageJson()?.type === 'module');

  const configs = [
    ...eslint_plugin_n.configs['flat/mixed-esm-and-cjs'],
    {
      files: options.files ?? (isModule ? ['*.cjs', '.*.cjs'] : ['*.cjs', '.*.cjs', '*.js', '.*.js']),
      plugins: {
        sukka: eslint_plugin_sukka,
        n: eslint_plugin_n
      },
      rules: {
        // enforces error handling in callbacks (node environment)
        'handle-callback-err': 'off',

        // disallow use of the Buffer() constructor
        // https://eslint.org/docs/rules/no-buffer-constructor
        // replaced by sukka/unicorn/no-new-buffer
        'no-buffer-constructor': 'off',
        'sukka/unicorn/no-new-buffer': 'error', // ban new Buffer, prefer Buffer.from

        // disallow use of new operator with the require function
        // replaced by eslint-plugin-n
        'no-new-require': 'off',
        'n/no-new-require': 'error',

        // disallow string concatenation with __dirname and __filename
        // https://eslint.org/docs/rules/no-path-concat
        // replaced by eslint-plugin-n
        'no-path-concat': 'off',
        'n/no-path-concat': 'error',

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
        'n/no-extraneous-require': 'off'
      },
      languageOptions: {
        globals: globals.node
      }
    }
  ];

  if (options.strict !== false) {
    configs.push({
      files: options.files ?? (isModule ? ['*.cjs', '.*.cjs'] : ['*.cjs', '.*.cjs', '*.js', '.*.js']),
      rules: {
        // enable strict mode for cjs
        strict: 'warn'
      }
    });
  }

  return configs;
};
