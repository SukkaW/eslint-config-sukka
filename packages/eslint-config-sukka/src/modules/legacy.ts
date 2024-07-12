import { memo, globals, type FlatESLintConfigItem } from '@eslint-sukka/shared';

import eslint_plugin_sukka from 'eslint-plugin-sukka';

export interface OptionsLegacy {
  browser?: boolean,
  node?: boolean,
  files?: FlatESLintConfigItem['files']
}

export const legacy = (options: OptionsLegacy = {}): FlatESLintConfigItem[] => {
  return [{
    name: '@eslint-sukka/legacy base',
    ...(options.files ? { files: options.files } : {}),
    plugins: {
      sukka: memo(eslint_plugin_sukka, 'eslint-plugin-sukka')
    },
    rules: {
      'prefer-numeric-literals': 'off',
      'no-restricted-properties': ['error', {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated'
      }, {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.'
      }, {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.'
      }],
      'no-var': 'off',
      'prefer-object-spread': 'off',
      strict: ['error', 'safe'],

      // default parameters is not supported in legacy environment
      'sukka/unicorn/prefer-default-parameters': 'off', // function foo(bar = 1) {}
      // nullable logical operator is not supported in legacy environment
      'sukka/unicorn/prefer-logical-operator-over-ternary': 'off', // foo ? foo : bar
      // optional catch binding is not supported in legacy environment
      'sukka/unicorn/prefer-optional-catch-binding': 'off' // try {} catch {}
    },
    languageOptions: {
      globals: {
        ...((options.browser ?? true) ? globals.browser : {}),
        ...((options.node ?? false) ? globals.node : {})
      }
    }
  }];
};
