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
    js: {
      env: {
        node: true
      }
    },
    node: true,
    ts: {
      enable: true,
      tsconfigPath: './tsconfig.json'
    }
  },
  {
    plugins: {
      '@stylistic/migrate': require('@stylistic/eslint-plugin-migrate')
    },
    rules: {
      '@stylistic/migrate/rules': 'error',
      camelcase: 'off',
      '@typescript-eslint/naming-convention': 'off'
    }
  }
);
