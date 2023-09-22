export const es6 = {
  plugins: ['@stylistic/js'],
  rules: {
  // require parens in arrow function arguments
  // https://eslint.org/docs/rules/arrow-parens
  // 'arrow-parens': ['error', 'always'],

    // require space before/after arrow function's arrow
    // https://eslint.org/docs/rules/arrow-spacing
    '@stylistic/js/arrow-spacing': ['error', { before: true, after: true }],

    // enforce the spacing around the * in generator functions
    // https://eslint.org/docs/rules/generator-star-spacing
    '@stylistic/js/generator-star-spacing': ['error', { before: false, after: true }],

    // disallow arrow functions where they could be confused with comparisons
    // https://eslint.org/docs/rules/no-confusing-arrow
    'no-confusing-arrow': ['error', { allowParens: true }],

    // disallow importing from the same path more than once
    // https://eslint.org/docs/rules/no-duplicate-imports
    // replaced by https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
    'no-duplicate-imports': 'off',

    // Disallow specified names in exports
    // https://eslint.org/docs/rules/no-restricted-exports
    'no-restricted-exports': ['error', {
      restrictedNamedExports: [
        'default', // use `export default` to provide a default export
        'then' // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
      ]
    }],

    // disallow unnecessary constructor
    // https://eslint.org/docs/rules/no-useless-constructor
    'no-useless-constructor': 'error',

    // disallow renaming import, export, and destructured assignments to the same name
    // https://eslint.org/docs/rules/no-useless-rename
    'no-useless-rename': ['error', {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false
    }],

    // require let or const instead of var
    'no-var': 'warn',

    // require method and property shorthand syntax for object literals
    // https://eslint.org/docs/rules/object-shorthand
    'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],

    // suggest using arrow functions as callbacks
    'prefer-arrow-callback': ['error', {
      allowNamedFunctions: false,
      allowUnboundThis: true
    }],

    // suggest using of const declaration for variables that are never modified after declared
    'prefer-const': ['error', { ignoreReadBeforeAssign: true }],

    // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    // https://eslint.org/docs/rules/prefer-numeric-literals
    'prefer-numeric-literals': 'error',

    // suggest using Reflect methods where applicable
    // https://eslint.org/docs/rules/prefer-reflect
    'prefer-reflect': 'off',

    // use rest parameters instead of arguments
    // https://eslint.org/docs/rules/prefer-rest-params
    'prefer-rest-params': 'error',

    // suggest using template literals instead of string concatenation
    // https://eslint.org/docs/rules/prefer-template
    'prefer-template': 'warn',

    '@stylistic/js/rest-spread-spacing': 'error',

    // require a Symbol description
    // https://eslint.org/docs/rules/symbol-description
    'symbol-description': 'error',

    // enforce usage of spacing in template strings
    // https://eslint.org/docs/rules/template-curly-spacing
    '@stylistic/js/template-curly-spacing': 'error',

    // enforce spacing around the * in yield* expressions
    // https://eslint.org/docs/rules/yield-star-spacing
    '@stylistic/js/yield-star-spacing': ['error', 'after']
  }
};
