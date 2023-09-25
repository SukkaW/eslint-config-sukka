'use strict';

const { sukka } = require('eslint-config-sukka');

module.exports = sukka({
  ignores: {
    customGlobs: [
      'packages/*/dist/**/*',
      '**/fixtures/**/*',
      '**/generated*'
    ]
  },
  node: {
    enable: true
  },
  ts: {
    enable: true,
    tsconfigPath: './tsconfig.json'
  }
}, {
  plugins: {
    '@stylistic/migrate': require('@stylistic/eslint-plugin-migrate')
  },
  rules: {
    '@stylistic/migrate/rules': 'error',
    camelcase: 'off',
    '@typescript-eslint/naming-convention': 'off'
  }
});
