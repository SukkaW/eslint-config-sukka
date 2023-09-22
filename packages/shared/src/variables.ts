import type { FlatESLintConfigItem } from 'eslint-define-config';

export const variables: FlatESLintConfigItem = {
  rules: {
  // disallow labels that share a name with a variable
  // https://eslint.org/docs/rules/no-label-var
    'no-label-var': 'error',

    // disallow use of variables before they are defined
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],

    'no-restricted-globals': [
      'error',
      {
        name: 'isFinite',
        message:
          'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite'
      },
      {
        name: 'isNaN',
        message:
          'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan'
      }
    ],
    // disallow use of undefined when initializing variables
    'no-undef-init': 'error'
  }
};
