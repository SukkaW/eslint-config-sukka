import { best_practices, errors, es6, style, variables, sukka } from '@eslint-sukka/shared';

export default {
  extends: ['eslint:recommended', 'plugin:n/recommended', 'plugin:i/recommended'],
  plugins: Array.from(new Set([
    ...best_practices.plugins,
    ...errors.plugins,
    ...es6.plugins,
    ...style.plugins,
    ...variables.plugins,
    ...sukka.plugins,
    'n'
  ])),
  rules: {
    ...best_practices.rules,
    ...errors.rules,
    ...es6.rules,
    ...style.rules,
    ...variables.rules,
    ...sukka.rules,

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
    'n/no-extraneous-require': 'off'
  },
  env: {
    node: true,
    es6: true
  }
};
