import type { FlatESLintConfig } from 'eslint-define-config';
import sukka from 'eslint-plugin-sukka';

export const sukka: FlatESLintConfig = {
  plugins: {
    sukka
  },
  rules: {
    'sukka/array/no-unneeded-flat-map': 'error',
    'sukka/browser/prefer-location-assign': 'warn',
    'sukka/jsx/no-template-literal': 'error',
    'sukka/jsx/no-unneeded-nested': 'error',
    'sukka/string/no-locale-case': 'warn',
    'sukka/string/no-simple-template-literal': 'error',
    'sukka/type/no-instanceof-wrapper': 'error',
    'sukka/unicode/no-bidi': 'warn',
    'sukka/unicode/no-invisible': 'warn',
    'sukka/ban-eslint-disable': ['error', 'allow-with-description'],
    'sukka/no-redundant-variable': 'error',
    'sukka/no-single-return': 'error',
    'sukka/prefer-early-return': ['error', { maximumStatements: 16 }],
    'sukka/prefer-fetch': 'error',
    'sukka/prefer-timer-id': 'warn'
  }
};
