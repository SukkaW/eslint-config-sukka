import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';
// @ts-expect-error -- missing -- eslint plugin
import * as stylisticJs from '@stylistic/eslint-plugin-js';

export const style: SukkaESLintRuleConfig = {
  plugins: {
    '@stylistic/js': stylisticJs
  },
  rules: {
    // enforce line breaks after opening and before closing array brackets
    // https://eslint.org/docs/rules/array-bracket-newline
    '@stylistic/js/array-bracket-newline': ['off', 'consistent'], // object option alternative: { multiline: true, minItems: 3 }

    // enforce line breaks between array elements
    // https://eslint.org/docs/rules/array-element-newline
    '@stylistic/js/array-element-newline': ['off', { multiline: true, minItems: 5 }],

    // enforce spacing inside array brackets
    '@stylistic/js/array-bracket-spacing': ['error', 'never'],

    // enforce spacing inside single-line blocks
    // https://eslint.org/docs/rules/block-spacing
    '@stylistic/js/block-spacing': ['error', 'always'],

    '@stylistic/js/arrow-spacing': ['error', { before: true, after: true }],

    // enforce one true brace style
    '@stylistic/js/brace-style': ['error', '1tbs', { allowSingleLine: true }],

    // require camel case names
    camelcase: ['warn', {
      properties: 'never',
      ignoreDestructuring: false,
      ignoreImports: true,
      ignoreGlobals: true,
      // @ts-expect-error -- the type is wrong here
      allow: ['^UNSAFE_', '^experimental_', '^__DEV__']
    }],

    'comma-dangle': ['error', 'never'],

    // enforce spacing before and after comma
    '@stylistic/js/comma-spacing': ['error', { before: false, after: true }],

    // enforce one true comma style
    '@stylistic/js/comma-style': ['error', 'last', {
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
    '@stylistic/js/computed-property-spacing': ['error', 'never'],

    // enforces consistent naming when capturing the current execution context
    'consistent-this': 'off',

    // enforce newline at the end of file, with no multiple empty lines
    'eol-last': ['error', 'always'],

    // https://eslint.org/docs/rules/function-call-argument-newline
    '@stylistic/js/function-call-argument-newline': ['off', 'consistent'],

    // enforce spacing between functions and their invocations
    // https://eslint.org/docs/rules/func-call-spacing
    '@stylistic/js/func-call-spacing': ['error', 'never'],

    // enforce consistent line breaks inside function parentheses
    // https://eslint.org/docs/rules/function-paren-newline
    '@stylistic/js/function-paren-newline': ['error', 'consistent'],

    // Enforce the location of arrow function bodies with implicit returns
    // https://eslint.org/docs/rules/implicit-arrow-linebreak
    '@stylistic/js/implicit-arrow-linebreak': ['error', 'beside'],

    '@stylistic/js/indent': ['error', 2, { SwitchCase: 1 }],

    // enforces spacing between keys and values in object literal properties
    '@stylistic/js/key-spacing': ['error', { beforeColon: false, afterColon: true }],

    // require a space before & after certain keywords
    '@stylistic/js/keyword-spacing': ['error', {
      before: true,
      after: true,
      overrides: {
        return: { after: true },
        throw: { after: true },
        case: { after: true }
      }
    }],

    '@stylistic/js/linebreak-style': 'error',
    '@stylistic/js/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],

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
    '@stylistic/js/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

    'no-extra-label': 'error',

    // disallow negated conditions
    // https://eslint.org/docs/rules/no-negated-condition
    'no-negated-condition': 'off',

    // disallow nested ternary expressions
    'no-nested-ternary': 'off', // replaced by sukka/unicorn/no-nested-ternary

    // disallow use of the Object constructor
    'no-new-object': 'error',

    // disallow the use of ternary operators
    'no-ternary': 'off',

    '@stylistic/js/no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',

    // disallow whitespace before properties
    // https://eslint.org/docs/rules/no-whitespace-before-property
    '@stylistic/js/no-whitespace-before-property': 'error',

    // Enforce consistent spacing inside braces
    // https://eslint.style/rules/js/object-curly-spacing
    '@stylistic/js/object-curly-spacing': ['error', 'always'],

    // Disallow the use of Math.pow in favor of the ** operator
    // https://eslint.org/docs/rules/prefer-exponentiation-operator
    'prefer-exponentiation-operator': 'error',

    '@stylistic/js/operator-linebreak': ['error', 'before'],
    quotes: ['error', 'single'],

    // require quotes around object literal property names
    // https://eslint.org/docs/rules/quote-props.html
    'quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

    'jsx-quotes': ['error', 'prefer-double'],

    // require or disallow use of semicolons instead of ASI
    semi: ['error', 'always'],

    // enforce spacing before and after semicolons
    '@stylistic/js/semi-spacing': ['error', { before: false, after: true }],

    // Enforce location of semicolons
    // https://eslint.org/docs/rules/semi-style
    '@stylistic/js/semi-style': ['error', 'last'],

    // require or disallow space before blocks
    '@stylistic/js/space-before-blocks': 'error',

    // require or disallow space before function opening parenthesis
    // https://eslint.org/docs/rules/space-before-function-paren
    '@stylistic/js/space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],

    // require or disallow spaces inside parentheses
    '@stylistic/js/space-in-parens': ['error', 'never'],

    // require spaces around operators
    '@stylistic/js/space-infix-ops': 'error',

    // Require or disallow spaces before/after unary operators
    // https://eslint.org/docs/rules/space-unary-ops
    '@stylistic/js/space-unary-ops': ['error', {
      words: true,
      nonwords: false,
      overrides: {}
    }],

    // require or disallow a space immediately following the // or /* in a comment
    // https://eslint.org/docs/rules/spaced-comment
    '@stylistic/js/spaced-comment': ['error', 'always', {
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
    '@stylistic/js/template-tag-spacing': ['error', 'never'],

    // require or disallow the Unicode Byte Order Mark
    // https://eslint.org/docs/rules/unicode-bom
    'unicode-bom': ['error', 'never'],

    // require regex literals to be wrapped in parentheses
    'wrap-regex': 'off'
  }
};
