'use strict';

module.exports = [
  {
    ignores: [
      'packages/*/dist/**/*',
      '**/fixtures/**/*',
      '**/generated*'
    ]
  },
  ...require('@eslint-sukka/node').node(),
  ...require('@eslint-sukka/ts').typescript({
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
