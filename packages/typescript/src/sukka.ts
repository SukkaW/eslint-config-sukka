export const sukka = {
  plugins: ['sukka'],
  rules: {
    '@fluffyfox/browser/prefer-event-target': 'warn',
    '@fluffyfox/browser/prefer-keyboard-event-key': 'warn',
    '@fluffyfox/browser/prefer-text-content': 'warn',
    '@fluffyfox/string/no-unneeded-to-string': 'error',
    // If you have a good reason to do this, please ignore this error and provide a comment about why this is type safe.
    '@fluffyfox/type/no-force-cast-via-top-type': 'error',
    '@fluffyfox/type/no-wrapper-type-reference': 'error',
    '@fluffyfox/no-default-error': 'off' // disable since this is way too slow
  }
};
