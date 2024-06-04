'use strict';

const { sukka, constants } = require('eslint-config-sukka');

module.exports = sukka(
  {
    ignores: {
      customGlobs: [
        ...constants.GLOB_EXCLUDE,
        '**/generated*'
      ]
    },
    node: true,
    react: true
  },
  {
    plugins: {
      '@stylistic/migrate': require('@stylistic/eslint-plugin-migrate')
    },
    rules: {
      '@stylistic/migrate/migrate': 'error',
      camelcase: 'off',
      '@typescript-eslint/naming-convention': 'off'
    }
  }
);
