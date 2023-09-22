'use strict';

module.exports = [
  {
    ignores: [
      'packages/*/dist/**/*',
      '**/fixtures/**/*'
    ]
  },
  ...require('@eslint-sukka/node').node(),
  ...require('@eslint-sukka/typescript').typescript({
    tsconfigPath: './tsconfig.json'
  }),
  {
    plugins: {
      '@stylistic/migrate': require('@stylistic/eslint-plugin-migrate')
    },
    rules: {
      '@stylistic/migrate/rules': 'error',
      camelcase: 'off'
    }
  }
];
