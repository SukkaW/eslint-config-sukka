import { best_practices, errors, es6, style, variables, sukka } from '@eslint-sukka/shared';

export default {
  extends: ['eslint:recommended'],
  plugins: Array.from(new Set([
    ...best_practices.plugins,
    ...errors.plugins,
    ...es6.plugins,
    ...style.plugins,
    ...variables.plugins,
    ...sukka.plugins
  ])),
  rules: {
    ...best_practices.rules,
    ...errors.rules,
    ...es6.rules,
    ...style.rules,
    ...variables.rules,
    ...sukka.rules,

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
    strict: ['error', 'safe']
  },
  env: {
    browser: true,
    node: true,
    amd: false,
    mocha: false,
    jasmine: false
  }
};
