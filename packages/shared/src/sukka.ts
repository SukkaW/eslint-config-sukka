export const sukka = {
  plugins: ['sukka'],
  rules: {
    '@fluffyfox/no-unneeded-array-flat-map': 'error',
    '@fluffyfox/browser/prefer-location-assign': 'warn',
    '@fluffyfox/jsx/no-template-literal': 'error',
    '@fluffyfox/jsx/no-unneeded-nested': 'error',
    '@fluffyfox/string/no-locale-case': 'warn',
    '@fluffyfox/string/no-simple-template-literal': 'error',
    '@fluffyfox/type/no-instanceof-wrapper': 'error',
    '@fluffyfox/unicode/no-bidi': 'warn',
    '@fluffyfox/unicode/no-invisible': 'warn',
    '@fluffyfox/ban-eslint-disable': ['error', 'allow-with-description'],
    '@fluffyfox/no-redundant-variable': 'error',
    '@fluffyfox/no-single-return': 'error',
    '@fluffyfox/prefer-early-return': ['error', { maximumStatements: 10 }],
    '@fluffyfox/prefer-fetch': 'error',
    '@fluffyfox/prefer-timer-id': 'warn'
  }
};
