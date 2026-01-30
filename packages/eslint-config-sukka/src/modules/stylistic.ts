import { stylistic_eslint_plugin } from '@eslint-sukka/eslint-plugin-stylistic';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import type { Linter } from 'eslint';

/** Private Options, not intended to be exposed to factory */
interface OptionsStylistic {
  ts: boolean,
  react: boolean
}

export function stylistic({ ts, react }: OptionsStylistic): FlatESLintConfigItem[] {
  // this is safe because JSON/YAML files won't have parsable regexes
  return [{
    name: 'sukka/stylistic',
    plugins: {
      '@stylistic': stylistic_eslint_plugin
    },
    rules: Object.assign<Linter.RulesRecord, Linter.RulesRecord, Linter.RulesRecord>(
      {
        /** JavaScript */

        // enforces consistent newlines before or after dots
        // https://eslint.style/rules/js/dot-location
        '@stylistic/dot-location': ['error', 'property'],

        // disallow use of multiple spaces
        // https://eslint.style/rules/js/no-multi-spaces
        '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: false }],

        // require immediate function invocation to be wrapped in parentheses
        // https://eslint.style/rules/wrap-iife
        '@stylistic/wrap-iife': ['error', 'inside', { functionPrototypeMethods: false }],

        // disallow unnecessary parentheses
        // https://eslint.org/docs/rules/no-extra-parens
        '@stylistic/no-extra-parens': ['off', 'all', {
          conditionalAssign: true,
          nestedBinaryExpressions: false,
          returnAssign: false,
          ignoreJSX: 'all', // delegate to eslint-plugin-react
          enforceForArrowConditionals: false
        }],

        // require space before/after arrow function's arrow
        // https://eslint.style/rules/js/arrow-spacing
        '@stylistic/arrow-spacing': ['error', { before: true, after: true }],

        // enforce the spacing around the * in generator functions
        // https://eslint.org/docs/rules/generator-star-spacing
        '@stylistic/generator-star-spacing': ['error', { before: true, after: false }],

        // require parens in arrow function arguments
        // https://eslint.org/docs/rules/arrow-parens
        // 'arrow-parens': ['error', 'always'],

        // disallow arrow functions where they could be confused with comparisons
        // https://eslint.org/docs/rules/no-confusing-arrow
        '@stylistic/no-confusing-arrow': ['error', { allowParens: true }],

        // enforce usage of spacing in template strings
        // https://eslint.style/rules/js/template-curly-spacing
        '@stylistic/template-curly-spacing': ['error', 'never'],

        // enforce spacing around the * in yield* expressions
        // https://eslint.style/rules/js/yield-star-spacing
        '@stylistic/yield-star-spacing': ['error', 'before'],

        // enforce line breaks after opening and before closing array brackets
        // https://eslint.org/docs/rules/array-bracket-newline
        '@stylistic/array-bracket-newline': ['off', 'consistent'], // object option alternative: { multiline: true, minItems: 3 }

        // enforce spacing inside array
        // https://eslint.style/rules/js/array-bracket-spacing
        '@stylistic/array-bracket-spacing': ['error', 'never'],

        // enforce line breaks between array elements
        // https://eslint.style/rules/js/array-element-newline
        '@stylistic/array-element-newline': ['off', { multiline: true, minItems: 5 }],

        // enforce spacing inside single-line blocks
        // https://eslint.style/rules/js/block-spacing
        '@stylistic/block-spacing': ['error', 'always'],

        // enforce one true brace style
        // https://eslint.style/rules/js/brace-style
        '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],

        // https://eslint.style/rules/js/comma-dangle
        '@stylistic/comma-dangle': ['error', 'never'/* 'always-multiline' */],

        // enforce spacing before and after
        // https://eslint.style/rules/js/comma-spacing
        '@stylistic/comma-spacing': ['error', { before: false, after: true }],

        // enforce one true comma style
        // https://eslint.style/rules/js/comma-style
        '@stylistic/comma-style': ['error', 'last', {
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
        '@stylistic/computed-property-spacing': ['error', 'never'],

        // enforce newline at the end of file, with no multiple empty lines
        '@stylistic/eol-last': ['error', 'always'],

        // enforce spacing between functions and their invocations
        // https://eslint.style/rules/function-call-spacing#function-call-spacing
        '@stylistic/function-call-spacing': ['error', 'never'],

        // https://eslint.org/docs/rules/function-call-argument-newline
        '@stylistic/function-call-argument-newline': ['off', 'consistent'],

        // enforce consistent line breaks inside function parentheses
        // https://eslint.style/rules/js/function-paren-newline
        '@stylistic/function-paren-newline': ['error', 'consistent'],

        // Enforce the location of arrow function bodies with implicit returns
        // https://eslint.style/rules/js/implicit-arrow-linebreak
        '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],

        // https://eslint.style/rules/js/indent
        '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
        '@stylistic/indent-binary-ops': ['error', 2],

        // enforces spacing between keys and values in object literal properties
        // https://eslint.style/rules/js/key-spacing
        '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],

        // https://eslint.style/rules/js/linebreak-style
        '@stylistic/linebreak-style': 'error',

        // https://eslint.style/rules/js/lines-around-comment
        '@stylistic/lines-around-comment': 'off',

        // https://eslint.style/rules/js/lines-around-directive
        // replaced by padding-line-between-statements
        '@stylistic/lines-around-directive': 'off', // ['error', 'always'],

        // https://eslint.style/rules/js/lines-between-class-members
        '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],

        // https://eslint.style/rules/js/multiline-ternary
        '@stylistic/multiline-ternary': ['error', 'always-multiline'],

        // https://eslint.style/rules/js/newline-per-chained-call
        '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 6 }],

        // disallow the omission of parentheses when invoking a constructor with no arguments
        // https://eslint.org/docs/rules/new-parens
        '@stylistic/new-parens': 'error',

        // disallow un-paren'd mixes of different operators
        // https://eslint.org/docs/rules/no-mixed-operators
        '@stylistic/no-mixed-operators': ['error', {
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
        '@stylistic/no-mixed-spaces-and-tabs': 'error',

        // disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
        // https://eslint.org/docs/rules/no-multiple-empty-lines
        '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

        // https://eslint.style/rules/js/no-spaced-func
        // replaced by func-call-spacing
        '@stylistic/no-spaced-func': 'off',

        // https://eslint.style/rules/js/no-tabs
        '@stylistic/no-tabs': 'error',

        // https://eslint.style/rules/js/no-trailing-spaces
        '@stylistic/no-trailing-spaces': 'error',

        // disallow whitespace before properties
        // https://eslint.style/rules/js/no-whitespace-before-property
        '@stylistic/no-whitespace-before-property': 'error',

        // https://eslint.style/rules/js/nonblock-statement-body-position
        '@stylistic/nonblock-statement-body-position': 'error',

        // https://eslint.style/rules/js/object-curly-newline
        '@stylistic/object-curly-newline': 'off',

        // Enforce consistent spacing inside braces
        // https://eslint.style/rules/js/object-curly-spacing
        '@stylistic/object-curly-spacing': ['error', 'always'],

        // https://eslint.style/rules/js/object-property-newline
        '@stylistic/object-property-newline': 'off',

        // https://eslint.style/rules/js/one-var-declaration-per-line
        '@stylistic/one-var-declaration-per-line': 'off',

        // https://eslint.style/rules/operator-linebreak
        '@stylistic/operator-linebreak': ['error', 'before', {
          overrides: {
            '=': 'after'
          }
        }],

        // https://eslint.style/rules/js/padded-blocks
        '@stylistic/padded-blocks': ['error', 'never'],

        // https://eslint.style/rules/js/padding-line-between-statements
        '@stylistic/padding-line-between-statements': [
          'error',
          // add line after
          { blankLine: 'always', prev: 'directive', next: '*' },
          // add line around (both before and after)
          { blankLine: 'always', prev: '*', next: ['class', 'with'] },
          { blankLine: 'always', prev: ['class', 'with'], next: '*' }
        ],

        // https://eslint.style/rules/js/quotes
        '@stylistic/quotes': ['error', 'single'],

        // require quotes around object literal property names
        // https://eslint.org/docs/rules/quote-props.html
        '@stylistic/quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

        '@stylistic/jsx-quotes': ['error', 'prefer-double'],

        // https://eslint.style/rules/js/rest-spread-spacing
        '@stylistic/rest-spread-spacing': ['error', 'never'],

        // require or disallow use of semicolons instead of ASI
        // https://eslint.style/rules/js/semi
        '@stylistic/semi': ['error', 'always'],

        // enforce spacing before and after semicolons
        // https://eslint.style/rules/js/semi-spacing
        '@stylistic/semi-spacing': ['error', { before: false, after: true }],

        // Enforce location of semicolons
        // https://eslint.style/rules/js/semi-style
        '@stylistic/semi-style': ['error', 'last'],

        // require or disallow space before blocks
        // https://eslint.style/rules/js/space-before-blocks
        '@stylistic/space-before-blocks': 'error',

        // require or disallow space before function opening parenthesis
        // https://eslint.style/rules/js/space-before-function-paren
        '@stylistic/space-before-function-paren': ['error', {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }],

        // require or disallow spaces inside parentheses
        // https://eslint.style/rules/js/space-in-parens
        '@stylistic/space-in-parens': ['error', 'never'],

        // require spaces around operators
        // https://eslint.style/rules/js/space-infix-ops
        '@stylistic/space-infix-ops': 'error',

        // Require or disallow spaces before/after unary operators
        // https://eslint.style/rules/js/space-unary-ops
        '@stylistic/space-unary-ops': ['error', {
          words: true,
          nonwords: false,
          overrides: {}
        }],

        // require or disallow a space immediately following the // or /* in a comment
        // https://eslint.style/rules/js/spaced-comment
        '@stylistic/spaced-comment': ['error', 'always', {
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
        '@stylistic/switch-colon-spacing': ['error', { after: true, before: false }],

        // Require or disallow spacing between template tags and their literals
        // https://eslint.style/rules/js/template-tag-spacing
        '@stylistic/template-tag-spacing': ['error', 'never'],

        // require regex literals to be wrapped in parentheses
        '@stylistic/wrap-regex': 'off',

        // require a space before & after certain keywords
        // https://eslint.style/rules/js/keyword-spacing
        '@stylistic/keyword-spacing': ['error', {
          before: true,
          after: true,
          overrides: {
            return: { after: true },
            throw: { after: true },
            case: { after: true }
          }
        }]
      },
      /** TypeScript */
      ts
        ? {
          // https://eslint.style/rules/ts/member-delimiter-style
          '@stylistic/member-delimiter-style': ['error', {
            multiline: { delimiter: 'comma', requireLast: false/** true */ },
            singleline: { delimiter: 'comma', requireLast: false }
          }],
          // https://eslint.style/rules/ts/lines-between-class-members
          '@stylistic/lines-between-class-members': [
            'error', 'always',
            { exceptAfterSingleLine: true, exceptAfterOverload: true }
          ],
          // https://eslint.style/rules/ts/padding-line-between-statements
          '@stylistic/padding-line-between-statements': [
            'error',
            // add line after
            { blankLine: 'always', prev: 'directive', next: '*' },
            // add line around (both before and after)
            { blankLine: 'always', prev: '*', next: ['class', 'with'] },
            { blankLine: 'always', prev: ['class', 'with'], next: '*' },
            { blankLine: 'any', prev: ['interface', 'type'], next: ['interface', 'type'] } // ts
          ],
          // https://eslint.style/rules/type-annotation-spacing
          '@stylistic/type-annotation-spacing': 'error',
          '@stylistic/arrow-spacing': [
            'error',
            {
              before: true,
              after: true
            }
          ],

          '@stylistic/type-generic-spacing': 'error',
          '@stylistic/type-named-tuple-spacing': 'error'
        }
        : {},
      /** React */
      react
        ? {
          // Enforce PascalCase for user-defined JSX components
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
          '@stylistic/jsx-pascal-case': ['error', {
            allowAllCaps: true,
            ignore: []
          }],

          // Enforce or disallow spaces inside of curly braces in JSX attributes
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
          '@stylistic/jsx-curly-spacing': ['error', 'never', { allowMultiline: true }],
          // Enforce event handler naming conventions in JSX
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
          // 'react/jsx-handler-names': ['off', {
          //  eventHandlerPrefix: 'handle',
          //  eventHandlerPropPrefix: 'on'
          // }],
          // Validate props indentation in JSX
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
          '@stylistic/jsx-indent-props': ['error', 2],
          // Limit maximum of props on a single line in JSX
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
          '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],

          // Prevent missing parentheses around multilines JSX
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-wrap-multilines.md
          '@stylistic/jsx-wrap-multilines': ['error', {
            declaration: 'parens-new-line',
            assignment: 'parens-new-line',
            return: 'parens-new-line',
            arrow: 'parens-new-line',
            condition: 'ignore',
            logical: 'ignore',
            prop: 'ignore'
          }],
          // Require that the first prop in a JSX element be on a new line when the element is multiline
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
          '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],

          // https://eslint.style/rules/jsx/jsx-function-call-newline
          '@stylistic/jsx-function-call-newline': ['error', 'multiline'],
          // Enforce spacing around jsx equals signs
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
          '@stylistic/jsx-equals-spacing': ['error', 'never'],
          // Enforce JSX indentation
          // https://github.com/eslint-stylistic/eslint-stylistic/pull/413
          // `@stylistic/jsx-indent` is replaced by `@stylistic/js/indent`
          '@stylistic/jsx-indent': 'off',

          // https://eslint.style/rules/jsx/jsx-child-element-spacing
          '@stylistic/jsx-child-element-spacing': 'error',

          // https://eslint.style/rules/jsx/jsx-closing-bracket-location
          '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],

          // Validate whitespace in and around the JSX opening and closing brackets
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-tag-spacing.md
          '@stylistic/jsx-tag-spacing': ['error', {
            closingSlash: 'never',
            beforeSelfClosing: 'always',
            afterOpening: 'never',
            beforeClosing: 'never'
          }],

          // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
          '@stylistic/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

          // Prevent extra closing tags for components without children
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
          // 'react/self-closing-comp': 'off',
          '@stylistic/jsx-self-closing-comp': 'error',

          // Enforce linebreaks in curly braces in JSX attributes and expressions.
          // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
          '@stylistic/jsx-curly-newline': ['error', {
            multiline: 'consistent',
            singleline: 'consistent'
          }]
        }
        : {}
    )
  }];
}
