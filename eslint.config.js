module.exports = [
  {
    ignores: [
      'packages/*/dist/**/*'
    ]
  },
  {
    plugins: {
      '@stylistic/migrate': require('@stylistic/eslint-plugin-migrate')
    },
    rules: {
      '@stylistic/migrate/rules': 'error'
    },
  },
  ...require('@eslint-sukka/node').node(),
  ...require('@eslint-sukka/typescript').typescript({
    tsconfigPath: './tsconfig.json'
  })
];
