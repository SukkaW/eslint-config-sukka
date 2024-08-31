import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import { RESTRICTED_IMPORT_NODE_REQUIRE, getPackageJson, globals, memo } from '@eslint-sukka/shared';

import eslint_plugin_sukka from 'eslint-plugin-sukka';
import eslint_plugin_n from 'eslint-plugin-n';

export interface OptionsNode {
  strict?: boolean,
  module?: boolean,
  files?: FlatESLintConfigItem['files'],
  hasTypeScript?: boolean,
  hasReact?: boolean
}

export const node = (options: OptionsNode = {}): FlatESLintConfigItem[] => {
  const isModule = options.module ?? (getPackageJson()?.type === 'module');

  const configs: FlatESLintConfigItem[] = [
    {
      name: '@eslint-sukka/node base',
      plugins: {
        sukka: memo(eslint_plugin_sukka, 'eslint-plugin-sukka'),
        n: memo(eslint_plugin_n, 'eslint-plugin-n')
      },
      rules: {
        'n/no-unsupported-features/es-syntax': 'off',

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
        // replaced by sukka/unicorn/no-process-exit
        'no-process-exit': 'off',
        'n/no-process-exit': 'off',
        'sukka/unicorn/no-process-exit': 'warn',

        // restrict usage of specified node modules
        'no-restricted-modules': 'off', // covered by ts presets

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

        'n/no-restricted-require': options.hasTypeScript ? 'off' /** covered by ts presets */ : ['error', RESTRICTED_IMPORT_NODE_REQUIRE],
        'n/prefer-node-protocol': 'off', // slower
        'sukka/unicorn/prefer-node-protocol': 'error',

        'n/process-exit-as-throw': 'error',

        // prefer-global
        'n/prefer-global/buffer': ['error', 'never'], // bundler can easily catch this to prevent runtime error
        'n/prefer-global/console': ['error', 'always'], // console is generally available
        'n/prefer-global/process': options.hasReact ? 'off' : ['error', 'never'], // bundler can easily catch this to prevent runtime error
        'n/prefer-global/text-decoder': ['error', 'always'], // text-decoder is generally available
        'n/prefer-global/text-encoder': ['error', 'always'], // text-encoder is generally available
        'n/prefer-global/url': ['error', 'always'], // url is generally available
        'n/prefer-global/url-search-params': ['error', 'always'], // url-search-params is generally available

        // prefer-promise
        'n/prefer-promises/dns': 'error'
      },
      languageOptions: {
        globals: globals.node
      }
    }
  ];

  if (options.strict !== false) {
    configs.push({
      name: '@eslint-sukka/node use strict',
      files: options.files ?? (isModule ? ['*.cjs', '.*.cjs'] : ['*.cjs', '.*.cjs', '*.js', '.*.js']),
      rules: {
        // enable strict mode for cjs
        strict: 'warn'
      }
    });
  }

  return configs;
};
