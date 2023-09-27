import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';

import sukkaPlugin from 'eslint-plugin-sukka';
// @ts-expect-error -- missing -- eslint plugin
import * as stylisticJs from '@stylistic/eslint-plugin-js';

export const style: SukkaESLintRuleConfig = {
  plugins: {
    '@stylistic/js': stylisticJs,
    sukka: sukkaPlugin
  },
  rules: {
    // enforce line breaks after opening and before closing array brackets
    // https://eslint.org/docs/rules/array-bracket-newline
    '@stylistic/js/array-bracket-newline': ['off', 'consistent'], // object option alternative: { multiline: true, minItems: 3 }

    // enforce spacing inside array
    // https://eslint.style/rules/js/array-bracket-spacing
    '@stylistic/js/array-bracket-spacing': ['error', 'never'],

    // enforce line breaks between array elements
    // https://eslint.style/rules/js/array-element-newline
    '@stylistic/js/array-element-newline': ['off', { multiline: true, minItems: 5 }],

    // https://eslint.style/rules/js/arrow-spacing
    '@stylistic/js/arrow-spacing': ['error', { before: true, after: true }],

    // enforce spacing inside single-line blocks
    // https://eslint.style/rules/js/block-spacing
    '@stylistic/js/block-spacing': ['error', 'always'],

    // enforce one true brace style
    // https://eslint.style/rules/js/brace-style
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

    // https://eslint.style/rules/js/comma-dangle
    '@stylistic/js/comma-dangle': ['error', 'never'/* 'always-multiline' */],

    // enforce spacing before and after
    // https://eslint.style/rules/js/comma-spacing
    '@stylistic/js/comma-spacing': ['error', { before: false, after: true }],

    // enforce one true comma style
    // https://eslint.style/rules/js/comma-style
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
    // https://eslint.style/rules/js/computed-property-spacing
    '@stylistic/js/computed-property-spacing': ['error', 'never'],

    // https://eslint.style/rules/js/dot-location
    '@stylistic/js/dot-location': ['error', 'property'],

    // enforces consistent naming when capturing the current execution context
    'consistent-this': 'off',

    // enforce newline at the end of file, with no multiple empty lines
    'eol-last': ['error', 'always'],

    // enforce spacing between functions and their invocations
    // https://eslint.org/docs/rules/func-call-spacing
    '@stylistic/js/func-call-spacing': ['error', 'never'],

    // https://eslint.org/docs/rules/function-call-argument-newline
    '@stylistic/js/function-call-argument-newline': ['off', 'consistent'],

    // enforce consistent line breaks inside function parentheses
    // https://eslint.style/rules/js/function-paren-newline
    '@stylistic/js/function-paren-newline': ['error', 'consistent'],

    // https://eslint.style/rules/js/generator-star-spacing
    '@stylistic/js/generator-star-spacing': ['error', 'before'],

    // Enforce the location of arrow function bodies with implicit returns
    // https://eslint.style/rules/js/implicit-arrow-linebreak
    '@stylistic/js/implicit-arrow-linebreak': ['error', 'beside'],

    // https://eslint.style/rules/js/indent
    '@stylistic/js/indent': ['error', 2, { SwitchCase: 1 }],

    // enforces spacing between keys and values in object literal properties
    // https://eslint.style/rules/js/key-spacing
    '@stylistic/js/key-spacing': ['error', { beforeColon: false, afterColon: true }],

    // require a space before & after certain keywords
    // https://eslint.style/rules/js/keyword-spacing
    '@stylistic/js/keyword-spacing': ['error', {
      before: true,
      after: true,
      overrides: {
        return: { after: true },
        throw: { after: true },
        case: { after: true }
      }
    }],

    // https://eslint.style/rules/js/linebreak-style
    '@stylistic/js/linebreak-style': 'error',

    // https://eslint.style/rules/js/lines-around-comment
    '@stylistic/js/lines-around-comment': 'off',

    // https://eslint.style/rules/js/lines-around-directive
    '@stylistic/js/lines-around-directive': ['error', 'always'],

    // https://eslint.style/rules/js/lines-between-class-members
    '@stylistic/js/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],

    // https://eslint.style/rules/js/multiline-ternary
    '@stylistic/js/multiline-ternary': 'off',

    // require a capital letter for constructors
    'new-cap': ['error', {
      newIsCap: true,
      newIsCapExceptions: [],
      capIsNew: false,
      capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List']
    }],

    // https://eslint.style/rules/js/newline-after-var
    '@stylistic/js/newline-after-var': 'off',

    // https://eslint.style/rules/js/newline-before-return
    '@stylistic/js/newline-before-return': 'off',

    // https://eslint.style/rules/js/newline-per-chained-call
    '@stylistic/js/newline-per-chained-call': ['error', { ignoreChainWithDepth: 6 }],

    // disallow the omission of parentheses when invoking a constructor with no arguments
    // https://eslint.org/docs/rules/new-parens
    'new-parens': 'error',

    'no-array-constructor': 'error',

    // disallow use of bitwise operators
    // https://eslint.org/docs/rules/no-bitwise
    'no-bitwise': 'off',

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

    // https://eslint.style/rules/js/no-mixed-spaces-and-tabs
    '@stylistic/js/no-mixed-spaces-and-tabs': 'error',

    // disallow use of chained assignment expressions
    // https://eslint.org/docs/rules/no-multi-assign
    'no-multi-assign': ['error'],

    // disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
    // https://eslint.org/docs/rules/no-multiple-empty-lines
    '@stylistic/js/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

    // https://eslint.style/rules/js/no-multi-spaces
    '@stylistic/js/no-multi-spaces': ['error', { ignoreEOLComments: false }],

    'no-extra-label': 'error',

    // disallow negated conditions
    // https://eslint.org/docs/rules/no-negated-condition
    'no-negated-condition': 'off',

    // disallow nested ternary expressions
    'no-nested-ternary': 'off', // replaced by sukka/unicorn/no-nested-ternary
    // disallow nested ternary expressions
    'sukka/unicorn/no-nested-ternary': 'warn',

    // disallow use of the Object constructor
    'no-new-object': 'error',

    // https://eslint.style/rules/js/no-spaced-func
    '@stylistic/js/no-spaced-func': 'error',

    // https://eslint.style/rules/js/no-tabs
    '@stylistic/js/no-tabs': 'error',

    // disallow the use of ternary operators
    'no-ternary': 'off',

    // https://eslint.style/rules/js/no-trailing-spaces
    '@stylistic/js/no-trailing-spaces': 'error',

    'no-unneeded-ternary': 'error',

    // disallow whitespace before properties
    // https://eslint.style/rules/js/no-whitespace-before-property
    '@stylistic/js/no-whitespace-before-property': 'error',

    // https://eslint.style/rules/js/nonblock-statement-body-position
    '@stylistic/js/nonblock-statement-body-position': 'error',

    // https://eslint.style/rules/js/object-curly-newline
    '@stylistic/js/object-curly-newline': 'off',

    // Enforce consistent spacing inside braces
    // https://eslint.style/rules/js/object-curly-spacing
    '@stylistic/js/object-curly-spacing': ['error', 'always'],

    // https://eslint.style/rules/js/object-property-newline
    '@stylistic/js/object-property-newline': 'off',

    // https://eslint.style/rules/js/one-var-declaration-per-line
    '@stylistic/js/one-var-declaration-per-line': 'off',
    // Disallow the use of Math.pow in favor of the ** operator
    // https://eslint.org/docs/rules/prefer-exponentiation-operator
    'prefer-exponentiation-operator': 'error',

    // https://eslint.style/rules/js/operator-linebreak
    '@stylistic/js/operator-linebreak': ['error', 'before'],

    // https://eslint.style/rules/js/padded-blocks
    '@stylistic/js/padded-blocks': ['error', 'never'],

    // https://eslint.style/rules/js/padding-line-between-statements
    '@stylistic/js/padding-line-between-statements': 'off',

    // https://eslint.style/rules/js/quotes
    '@stylistic/js/quotes': ['error', 'single'],

    // require quotes around object literal property names
    // https://eslint.org/docs/rules/quote-props.html
    'quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

    'jsx-quotes': ['error', 'prefer-double'],

    // https://eslint.style/rules/js/rest-spread-spacing
    '@stylistic/js/rest-spread-spacing': ['error', 'never'],

    // require or disallow use of semicolons instead of ASI
    // https://eslint.style/rules/js/semi
    '@stylistic/js/semi': ['error', 'always'],

    // enforce spacing before and after semicolons
    // https://eslint.style/rules/js/semi-spacing
    '@stylistic/js/semi-spacing': ['error', { before: false, after: true }],

    // Enforce location of semicolons
    // https://eslint.style/rules/js/semi-style
    '@stylistic/js/semi-style': ['error', 'last'],

    // require or disallow space before blocks
    // https://eslint.style/rules/js/space-before-blocks
    '@stylistic/js/space-before-blocks': 'error',

    // require or disallow space before function opening parenthesis
    // https://eslint.style/rules/js/space-before-function-paren
    '@stylistic/js/space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],

    // require or disallow spaces inside parentheses
    // https://eslint.style/rules/js/space-in-parens
    '@stylistic/js/space-in-parens': ['error', 'never'],

    // require spaces around operators
    // https://eslint.style/rules/js/space-infix-ops
    '@stylistic/js/space-infix-ops': 'error',

    // Require or disallow spaces before/after unary operators
    // https://eslint.style/rules/js/space-unary-ops
    '@stylistic/js/space-unary-ops': ['error', {
      words: true,
      nonwords: false,
      overrides: {}
    }],

    // require or disallow a space immediately following the // or /* in a comment
    // https://eslint.style/rules/js/spaced-comment
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

    // https://eslint.style/rules/js/switch-colon-spacing
    '@stylistic/js/switch-colon-spacing': ['error', { after: true, before: false }],

    // https://eslint.style/rules/js/template-curly-spacing
    '@stylistic/js/template-curly-spacing': ['error', 'never'],

    // Require or disallow spacing between template tags and their literals
    // https://eslint.style/rules/js/template-tag-spacing
    '@stylistic/js/template-tag-spacing': ['error', 'never'],

    // require or disallow the Unicode Byte Order Mark
    // https://eslint.org/docs/rules/unicode-bom
    'unicode-bom': ['error', 'never'],

    // require regex literals to be wrapped in parentheses
    'wrap-regex': 'off',

    // https://eslint.style/rules/js/yield-star-spacing
    '@stylistic/js/yield-star-spacing': ['error', 'before']
  }
};
