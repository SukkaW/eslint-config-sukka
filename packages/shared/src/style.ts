export const style = {
    // enforce line breaks after opening and before closing array brackets
  // https://eslint.org/docs/rules/array-bracket-newline
  'array-bracket-newline': ['off', 'consistent'], // object option alternative: { multiline: true, minItems: 3 }

  // enforce line breaks between array elements
  // https://eslint.org/docs/rules/array-element-newline
  'array-element-newline': ['off', { multiline: true, minItems: 5 }],

  // enforce spacing inside array brackets
  'array-bracket-spacing': ['error', 'never'],

  // enforce spacing inside single-line blocks
  // https://eslint.org/docs/rules/block-spacing
  'block-spacing': ['error', 'always'],

  'arrow-spacing': ['error', { before: true, after: true }],

  // enforce one true brace style
  'brace-style': ['error', '1tbs', { allowSingleLine: true }],

  // require camel case names
  camelcase: ['warn', {
    properties: 'never',
    ignoreDestructuring: false,
    ignoreImports: true,
    ignoreGlobals: true,
    allow: ['^UNSAFE_', '^experimental_', '^__DEV__']
  }],

  'comma-dangle': ['error', 'never'],

  // enforce spacing before and after comma
  'comma-spacing': ['error', { before: false, after: true }],

  // enforce one true comma style
  'comma-style': ['error', 'last', {
    exceptions: {
      ArrayExpression: false,
      ArrayPattern: false,
      ArrowFunctionExpression: false,
      CallExpression: false,
      FunctionDeclaration: false,
      FunctionExpression: false,
      ImportDeclaration: false,
      ObjectExpression: false,
      ObjectPattern: false,
      VariableDeclaration: false,
      NewExpression: false
    }
  }],

  // disallow padding inside computed properties
  'computed-property-spacing': ['error', 'never'],

  // enforces consistent naming when capturing the current execution context
  'consistent-this': 'off',

  // enforce newline at the end of file, with no multiple empty lines
  'eol-last': ['error', 'always'],

  // https://eslint.org/docs/rules/function-call-argument-newline
  'function-call-argument-newline': ['off', 'consistent'],

  // enforce spacing between functions and their invocations
  // https://eslint.org/docs/rules/func-call-spacing
  'func-call-spacing': ['error', 'never'],

  // enforce consistent line breaks inside function parentheses
  // https://eslint.org/docs/rules/function-paren-newline
  'function-paren-newline': ['error', 'consistent'],

  // Enforce the location of arrow function bodies with implicit returns
  // https://eslint.org/docs/rules/implicit-arrow-linebreak
  'implicit-arrow-linebreak': ['error', 'beside'],

  indent: ['error', 2, { SwitchCase: 1 }],

  // enforces spacing between keys and values in object literal properties
  'key-spacing': ['error', { beforeColon: false, afterColon: true }],

  // require a space before & after certain keywords
  'keyword-spacing': ['error', {
    before: true,
    after: true,
    overrides: {
      return: { after: true },
      throw: { after: true },
      case: { after: true }
    }
  }],

  'linebreak-style': 'error',
  'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],

  // require a capital letter for constructors
  'new-cap': ['error', {
    newIsCap: true,
    newIsCapExceptions: [],
    capIsNew: false,
    capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List']
  }],

  // disallow the omission of parentheses when invoking a constructor with no arguments
  // https://eslint.org/docs/rules/new-parens
  'new-parens': 'error',

  'no-array-constructor': 'error',

  // disallow use of bitwise operators
  // https://eslint.org/docs/rules/no-bitwise
  'no-bitwise': 'warn',

  // disallow if as the only statement in an else block
  // https://eslint.org/docs/rules/no-lonely-if
  'no-lonely-if': 'error',

  // disallow un-paren'd mixes of different operators
  // https://eslint.org/docs/rules/no-mixed-operators
  'no-mixed-operators': ['error', {
    groups: [
      ['**', '+'],
      ['**', '-'],
      ['**', '*'],
      ['**', '/'],
      ['%', '+'],
      ['%', '-'],
      ['%', '*'],
      ['%', '/'],
      ['%', '**'],
      ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
      ['&&', '||'],
      ['in', 'instanceof']
    ],
    allowSamePrecedence: true
  }],

  // disallow use of chained assignment expressions
  // https://eslint.org/docs/rules/no-multi-assign
  'no-multi-assign': ['error'],

  // disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
  // https://eslint.org/docs/rules/no-multiple-empty-lines
  'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

  'no-extra-label': 'error',

  // disallow negated conditions
  // https://eslint.org/docs/rules/no-negated-condition
  'no-negated-condition': 'off',

  // disallow nested ternary expressions
  'no-nested-ternary': 'warn',

  // disallow use of the Object constructor
  'no-new-object': 'error',

  // disallow the use of ternary operators
  'no-ternary': 'off',

  'no-trailing-spaces': 'error',
  'no-unneeded-ternary': 'error',

  // disallow whitespace before properties
  // https://eslint.org/docs/rules/no-whitespace-before-property
  'no-whitespace-before-property': 'error',

  // Disallow the use of Math.pow in favor of the ** operator
  // https://eslint.org/docs/rules/prefer-exponentiation-operator
  'prefer-exponentiation-operator': 'error',

  'operator-linebreak': ['error', 'before'],
  quotes: ['error', 'single'],

  // require quotes around object literal property names
  // https://eslint.org/docs/rules/quote-props.html
  'quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

  'jsx-quotes': ['error', 'prefer-double'],

  // require or disallow use of semicolons instead of ASI
  semi: ['error', 'always'],

  // enforce spacing before and after semicolons
  'semi-spacing': ['error', { before: false, after: true }],

  // Enforce location of semicolons
  // https://eslint.org/docs/rules/semi-style
  'semi-style': ['error', 'last'],

  // require or disallow space before blocks
  'space-before-blocks': 'error',

  // require or disallow space before function opening parenthesis
  // https://eslint.org/docs/rules/space-before-function-paren
  'space-before-function-paren': ['error', {
    anonymous: 'always',
    named: 'never',
    asyncArrow: 'always'
  }],

  // require or disallow spaces inside parentheses
  'space-in-parens': ['error', 'never'],

  // require spaces around operators
  'space-infix-ops': 'error',

  // Require or disallow spaces before/after unary operators
  // https://eslint.org/docs/rules/space-unary-ops
  'space-unary-ops': ['error', {
    words: true,
    nonwords: false,
    overrides: {}
  }],

  // require or disallow a space immediately following the // or /* in a comment
  // https://eslint.org/docs/rules/spaced-comment
  'spaced-comment': ['error', 'always', {
    line: {
      exceptions: ['-', '+'],
      markers: ['=', '!', '/'] // space here to support sprockets directives, slash for TS /// comments
    },
    block: {
      exceptions: ['-', '+'],
      markers: ['=', '!', ':', '::'], // space here to support sprockets directives and flow comment types
      balanced: true
    }
  }],

  // Require or disallow spacing between template tags and their literals
  // https://eslint.org/docs/rules/template-tag-spacing
  'template-tag-spacing': ['error', 'never'],

  // require or disallow the Unicode Byte Order Mark
  // https://eslint.org/docs/rules/unicode-bom
  'unicode-bom': ['error', 'never'],

  // require regex literals to be wrapped in parentheses
  'wrap-regex': 'off'
}
