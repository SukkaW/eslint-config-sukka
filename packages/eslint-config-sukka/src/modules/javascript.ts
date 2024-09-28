// @ts-expect-error -- no types
import eslint_js from '@eslint/js';
import { memo, RESTRICTED_IMPORT_JS, constants, globals, getPackageJson } from '@eslint-sukka/shared';

import stylisticJs from '@stylistic/eslint-plugin-js';
import stylisticPlus from '@stylistic/eslint-plugin-plus';
import eslint_plugin_unused_imports from 'eslint-plugin-unused-imports';
import eslint_plugin_import_x from 'eslint-plugin-import-x';
import eslint_plugin_sukka from 'eslint-plugin-sukka';

// @ts-expect-error -- no types
import eslint_plugin_autofix from 'eslint-plugin-autofix';
// import eslint_plugin_no_secrets from 'eslint-plugin-no-secrets';

import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

export interface OptionsJavaScript {
  module?: boolean,
  /**
   * Apply the config to specific files. Default to eslint default.
   *
   * @default undefined
   */
  files?: FlatESLintConfigItem['files'] | undefined,
  /**
   * Disable `no-console` rule in CLI files.
   *
   * - true: disable `no-console` in preset files glob
   * - false: do not disable `no-console`
   * - string | string[]: custom glob to disable `no-console`
   *
   * @default true
   */
  disableNoConsoleInCLI?: boolean | string | string[],
  env?: {
    // env
    /**
     * Enable browser global variables.
     *
     * @default true
     */
    browser?: boolean,
    /**
     * Enable webextensions global variables.
     *
     * @default false
     */
    webextensions?: boolean,
    /**
     * Enable userscript global variables.
     *
     * @default false
     */
    greasemonkey?: boolean,
    /**
     * Custom global variables.
     *
     * @see [Configuring global variables](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#configuring-global-variables)
     */
    customGlobals?: { [name: string]: boolean | 'off' | 'readonly' | 'readable' | 'writable' | 'writeable' } | undefined
  }
}

const allExtensions = ['.js', '.jsx', '.mjs', '.cjs'];

export const javascript = (options: OptionsJavaScript = {}): FlatESLintConfigItem[] => {
  const {
    files,
    disableNoConsoleInCLI = true,
    env = {}
  } = options;
  const { browser = true, webextensions = false, greasemonkey = false, customGlobals = {} } = env;

  const isModule = options.module ?? (getPackageJson()?.type === 'module');

  const configs: FlatESLintConfigItem[] = [
    {
      linterOptions: {
        reportUnusedDisableDirectives: true
      }
    },
    {
      name: '@eslint/js recommended',
      ...eslint_js.configs.recommended
    },
    {
      name: '@eslint-sukka/js base',
      ...(files ? { files } : {}),
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: isModule ? 'module' : 'commonjs',
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: isModule ? 'module' : 'commonjs',
          ecmaFeatures: {
            jsx: true
          }
        },
        globals: {
          ...globals.es2025,
          ...(browser && globals.browser),
          ...(webextensions && globals.webextensions),
          ...(greasemonkey && globals.greasemonkey),
          ...customGlobals
        }
      } satisfies FlatESLintConfigItem['languageOptions'],
      settings: {
        'import-x/parsers': {
          // TODO: remove this line once  #2556 is fixed
          espree: allExtensions
        },
        'import-x/extensions': allExtensions
      },
      plugins: {
        'unused-imports': memo(eslint_plugin_unused_imports, 'eslint-plugin-unused-imports'),
        '@stylistic/js': memo(stylisticJs, '@stylistic/eslint-plugin-js'),
        '@stylistic/plus': memo(stylisticPlus, '@stylistic/eslint-plugin-plus'),
        sukka: memo(eslint_plugin_sukka, 'eslint-plugin-sukka'),
        'import-x': memo(eslint_plugin_import_x, 'eslint-plugin-import-x'),
        autofix: eslint_plugin_autofix
      },
      rules: {
        ...eslint_plugin_import_x.configs.recommended.rules,

        'import-x/newline-after-import': ['error', { considerComments: false }],
        'import-x/no-absolute-path': 'error',
        'import-x/no-empty-named-blocks': 'error',
        'import-x/no-mutable-exports': 'error',
        'import-x/no-useless-path-segments': 'warn',
        'import-x/no-webpack-loader-syntax': 'error',

        // 'no-secrets/no-secrets': 'error',

        // enforces getter/setter pairs in objects
        // https://eslint.org/docs/rules/accessor-pairs
        'accessor-pairs': 'off',

        // enforces return statements in callbacks of array's methods
        // https://eslint.org/docs/rules/array-callback-return
        'array-callback-return': ['error', { allowImplicit: true }],

        'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],

        // treat var statements as if they were block scoped
        // https://eslint.org/docs/rules/block-scoped-var
        'block-scoped-var': 'error',

        // enforce that class methods use "this"
        // https://eslint.org/docs/rules/class-methods-use-this
        'class-methods-use-this': ['error', {
          exceptMethods: []
        }],

        // specify curly brace conventions for all control statements
        // https://eslint.org/docs/rules/curly
        curly: ['error', 'multi-line'], // multiline

        // require default case in switch statements
        // https://eslint.org/docs/rules/default-case
        'default-case': ['error', { commentPattern: '^no default$' }],

        // Enforce default clauses in switch statements to be last
        'default-case-last': 'error',

        // https://eslint.org/docs/rules/default-param-last
        'default-param-last': 'error',

        // encourages use of dot notation whenever possible
        // https://eslint.org/docs/rules/dot-notation
        'dot-notation': ['error', { allowKeywords: true }],

        // enforces consistent newlines before or after dots
        // https://eslint.style/rules/js/dot-location
        '@stylistic/js/dot-location': ['error', 'property'],

        // require the use of === and !==
        // https://eslint.org/docs/rules/eqeqeq
        eqeqeq: ['error', 'always', { null: 'ignore' }],

        // Require grouped accessor pairs in object literals and classes
        // https://eslint.org/docs/rules/grouped-accessor-pairs
        'grouped-accessor-pairs': 'error',

        // make sure for-in loops have an if statement
        // https://eslint.org/docs/rules/guard-for-in
        'guard-for-in': 'error',

        // disallow the use of alert, confirm, and prompt
        // https://eslint.org/docs/rules/no-alert
        'no-alert': 'warn',

        // disallow use of arguments.caller or arguments.callee
        'no-caller': 'off',
        'autofix/no-caller': 'error',

        // Disallow returning value in constructor
        // https://eslint.org/docs/rules/no-constructor-return
        'no-constructor-return': 'error',

        // disallow else after a return in an if
        // https://eslint.org/docs/rules/no-else-return
        'no-else-return': ['error', { allowElseIf: false }],

        // disallow empty destructuring patterns
        // https://eslint.org/docs/rules/no-empty-pattern
        'no-empty-pattern': 'error',

        // Disallow empty static blocks
        // https://eslint.org/docs/latest/rules/no-empty-static-block
        'no-empty-static-block': 'error',

        // disallow use of eval()
        // https://eslint.org/docs/rules/no-eval
        'no-eval': 'error',

        // disallow adding to native types
        // https://eslint.org/docs/rules/no-extend-native
        'no-extend-native': 'error',

        // disallow unnecessary function binding
        // https://eslint.org/docs/rules/no-extra-bind
        'no-extra-bind': 'error',

        // disallow Unnecessary Labels
        // https://eslint.org/docs/rules/no-extra-label
        'no-extra-label': 'error',

        // disallow implicit type conversions
        // https://eslint.org/docs/rules/no-implicit-coercion
        'no-implicit-coercion': ['off', {
          boolean: false,
          number: true,
          string: true,
          allow: []
        }],

        // disallow var and named functions in global scope
        // https://eslint.org/docs/rules/no-implicit-globals
        'no-implicit-globals': 'off',

        // disallow use of eval()-like methods
        'no-implied-eval': 'error',

        // disallow this keywords outside of classes or class-like objects
        'no-invalid-this': 'off',

        // disallow use of labels for anything other then loops and switches
        'no-labels': ['error', { allowLoop: false, allowSwitch: false }],

        // disallow unnecessary nested blocks
        'no-lone-blocks': 'error',

        // disallow creation of functions within loops
        'no-loop-func': 'error',

        // disallow use of multiple spaces
        // https://eslint.style/rules/js/no-multi-spaces
        '@stylistic/js/no-multi-spaces': ['error', { ignoreEOLComments: false }],

        // disallow use of multiline strings
        'no-multi-str': 'error',

        // disallow use of new operator when not part of the assignment or comparison
        'no-new': 'error',

        // disallow use of new operator for Function object
        'no-new-func': 'error',

        // disallows creating new instances of String, Number, and Boolean
        'no-new-wrappers': 'error',

        // disallow use of octal escape sequences in string literals, such as
        // var foo = 'Copyright \251';
        'no-octal-escape': 'error',

        // disallow usage of __proto__ property
        'no-proto': 'off',
        'autofix/no-proto': 'error',

        // disallow certain object properties
        // https://eslint.org/docs/rules/no-restricted-properties
        'no-restricted-properties': [
          'error',
          ...(([
            ['isFinite', 'Number.isFinite'],
            ['isNaN', 'Number.isNaN']
          ] as const).flatMap(([methodName, replacement]) => ([
            'global',
            'globalThis',
            'window',
            'self'
          ] as const).map(globalName => ({
            object: globalName,
            property: methodName,
            message: `Please use ${replacement} instead`
          })))),
          {
            object: 'arguments',
            property: 'callee',
            message: 'arguments.callee is deprecated'
          },
          {
            property: '__defineGetter__',
            message: 'Please use Object.defineProperty instead.'
          },
          {
            property: '__defineSetter__',
            message: 'Please use Object.defineProperty instead.'
          },
          {
            object: 'Math',
            property: 'pow',
            message: 'Use the exponentiation operator (**) instead.'
          }
        ],

        // disallow use of assignment in return statement
        'no-return-assign': ['error', 'always'],

        // disallow redundant `return await`
        'no-return-await': 'off',
        'sukka/no-return-await': 'error',

        // comparisons where both sides are exactly the same
        // This is way faster than Number.isNaN
        'no-self-compare': 'off',

        'no-sequences': 'error',

        // disallow unmodified conditions of loops
        // https://eslint.org/docs/rules/no-unmodified-loop-condition
        'no-unmodified-loop-condition': 'off',

        // disallow usage of expressions in statement position
        'no-unused-expressions': ['error', {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false
        }],

        // disallow unnecessary .call() and .apply()
        'no-useless-call': 'off',

        // Disallow unnecessary catch clauses
        // https://eslint.org/docs/rules/no-useless-catch
        'no-useless-catch': 'off',
        'autofix/no-useless-catch': 'error',

        // disallow useless string concatenation
        // https://eslint.org/docs/rules/no-useless-concat
        'no-useless-concat': 'off',
        'autofix/no-useless-concat': 'error',

        // disallow unnecessary string escaping
        // https://eslint.org/docs/rules/no-useless-escape
        'no-useless-escape': 'error',

        // disallow redundant return; keywords
        // https://eslint.org/docs/rules/no-useless-return
        'no-useless-return': 'error',

        // disallow use of void operator
        // https://eslint.org/docs/rules/no-void
        // https://typescript-eslint.io/rules/no-floating-promises/#ignorevoid
        'no-void': ['error', { allowAsStatement: true }],

        // disallow use of the with statement
        'no-with': 'error',

        // require using Error objects as Promise rejection reasons
        // https://eslint.org/docs/rules/prefer-promise-reject-errors
        'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

        // Prefer Object.hasOwn() over Object.prototype.hasOwnProperty.call()
        // https://eslint.org/docs/rules/prefer-object-has-own
        'prefer-object-has-own': 'error',

        // https://eslint.org/docs/rules/prefer-regex-literals
        'prefer-regex-literals': ['error', {
          disallowRedundantWrapping: true
        }],

        // require use of the second argument for parseInt()
        radix: 'off',
        'autofix/radix': 'error',

        // require `await` in `async function`
        // https://eslint.org/docs/rules/require-await
        'require-await': 'error',

        'require-yield': 'error',

        // Enforce the use of u flag on RegExp
        // https://eslint.org/docs/rules/require-unicode-regexp
        'require-unicode-regexp': 'off',

        // requires to declare all vars on top of their containing scope
        'vars-on-top': 'error',

        // require immediate function invocation to be wrapped in parentheses
        // https://eslint.org/docs/rules/wrap-iife.html
        '@stylistic/js/wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],

        // require or disallow Yoda conditions
        yoda: 'error',

        // Disallow await inside of loops
        // https://eslint.org/docs/rules/no-await-in-loop
        'no-await-in-loop': 'warn',

        // disallow use of console
        'no-console': 'warn',

        // disallow use of constant expressions in conditions
        'no-constant-condition': 'warn',

        'no-empty-function': 'error',
        'no-empty': ['error', { allowEmptyCatch: true }],

        // Disallows expressions where the operation doesn't affect the value
        // https://eslint.org/docs/rules/no-constant-binary-expression
        'no-constant-binary-expression': 'error',

        // disallow unnecessary parentheses
        // https://eslint.org/docs/rules/no-extra-parens
        '@stylistic/js/no-extra-parens': ['off', 'all', {
          conditionalAssign: true,
          nestedBinaryExpressions: false,
          returnAssign: false,
          ignoreJSX: 'all', // delegate to eslint-plugin-react
          enforceForArrowConditionals: false
        }],

        // Disallow Number Literals That Lose Precision
        // https://eslint.org/docs/rules/no-loss-of-precision
        'no-loss-of-precision': 'warn',

        // Disallow returning values from Promise executor functions
        // https://eslint.org/docs/rules/no-promise-executor-return
        'no-promise-executor-return': 'error',

        // Disallow template literal placeholder syntax in regular strings
        // https://eslint.org/docs/rules/no-template-curly-in-string
        'no-template-curly-in-string': 'error',

        // Disallow loops with a body that allows only one iteration
        // https://eslint.org/docs/rules/no-unreachable-loop
        'no-unreachable-loop': ['error', {
          ignore: [] // WhileStatement, DoWhileStatement, ForStatement, ForInStatement, ForOfStatement
        }],

        'no-unused-vars': [
          'error',
          { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true }
        ],
        'unused-imports/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'off',

        // Disallow Unused Private Class Members
        // https://eslint.org/docs/rules/no-unused-private-class-members
        'no-unused-private-class-members': 'error',

        // Disallow useless backreferences in regular expressions
        // https://eslint.org/docs/rules/no-useless-backreference
        'no-useless-backreference': 'error',

        // disallow negation of the left operand of an in expression
        // deprecated in favor of no-unsafe-negation
        'no-negated-in-lhs': 'off',

        // Disallow assignments that can lead to race conditions due to usage of await or yield
        // https://eslint.org/docs/rules/require-atomic-updates
        // note: not enabled because it is very buggy
        'require-atomic-updates': 'off',

        // disallow comparisons with the value NaN
        'use-isnan': ['error', { enforceForIndexOf: true }],

        // ensure that the results of typeof are compared against a valid string
        // https://eslint.org/docs/rules/valid-typeof
        'valid-typeof': 'off',
        'autofix/valid-typeof': ['error', { requireStringLiterals: true }],

        // Disallow new operators with global non-constructor functions
        // https://eslint.org/docs/latest/rules/no-new-native-nonconstructor
        'no-new-native-nonconstructor': 'off',
        'autofix/no-new-native-nonconstructor': 'error',

        // require parens in arrow function arguments
        // https://eslint.org/docs/rules/arrow-parens
        // 'arrow-parens': ['error', 'always'],

        // require space before/after arrow function's arrow
        // https://eslint.style/rules/js/arrow-spacing
        '@stylistic/js/arrow-spacing': ['error', { before: true, after: true }],

        // enforce the spacing around the * in generator functions
        // https://eslint.org/docs/rules/generator-star-spacing
        '@stylistic/js/generator-star-spacing': ['error', { before: true, after: false }],

        // disallow arrow functions where they could be confused with comparisons
        // https://eslint.org/docs/rules/no-confusing-arrow
        '@stylistic/js/no-confusing-arrow': ['error', { allowParens: true }],

        // disallow importing from the same path more than once
        // https://eslint.org/docs/rules/no-duplicate-imports
        // replaced by eslint-plugin-import-x
        'no-duplicate-imports': 'off',

        // Disallow specified names in exports
        // https://eslint.org/docs/rules/no-restricted-exports
        'no-restricted-exports': ['error', {
          restrictedNamedExports: [
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
        'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true, avoidExplicitReturnArrows: true }],

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

        // use rest parameters instead of arguments
        // https://eslint.org/docs/rules/prefer-rest-params
        'prefer-rest-params': 'error',

        // suggest using template literals instead of string concatenation
        // https://eslint.org/docs/rules/prefer-template
        'prefer-template': 'off',

        // require a Symbol description
        // https://eslint.org/docs/rules/symbol-description
        'symbol-description': 'error',

        // enforce usage of spacing in template strings
        // https://eslint.style/rules/js/template-curly-spacing
        '@stylistic/js/template-curly-spacing': ['error', 'never'],

        // enforce spacing around the * in yield* expressions
        // https://eslint.style/rules/js/yield-star-spacing
        '@stylistic/js/yield-star-spacing': ['error', 'before'],

        // enforce line breaks after opening and before closing array brackets
        // https://eslint.org/docs/rules/array-bracket-newline
        '@stylistic/js/array-bracket-newline': ['off', 'consistent'], // object option alternative: { multiline: true, minItems: 3 }

        // enforce spacing inside array
        // https://eslint.style/rules/js/array-bracket-spacing
        '@stylistic/js/array-bracket-spacing': ['error', 'never'],

        // enforce line breaks between array elements
        // https://eslint.style/rules/js/array-element-newline
        '@stylistic/js/array-element-newline': ['off', { multiline: true, minItems: 5 }],

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

        // enforces consistent naming when capturing the current execution context
        'consistent-this': 'off',

        // enforce newline at the end of file, with no multiple empty lines
        '@stylistic/js/eol-last': ['error', 'always'],

        // enforce spacing between functions and their invocations
        // https://eslint.org/docs/rules/func-call-spacing
        '@stylistic/js/func-call-spacing': ['error', 'never'],

        // https://eslint.org/docs/rules/function-call-argument-newline
        '@stylistic/js/function-call-argument-newline': ['off', 'consistent'],

        // enforce consistent line breaks inside function parentheses
        // https://eslint.style/rules/js/function-paren-newline
        '@stylistic/js/function-paren-newline': ['error', 'consistent'],

        // Enforce the location of arrow function bodies with implicit returns
        // https://eslint.style/rules/js/implicit-arrow-linebreak
        '@stylistic/js/implicit-arrow-linebreak': ['error', 'beside'],

        // https://eslint.style/rules/js/indent
        '@stylistic/js/indent': ['error', 2, { SwitchCase: 1 }],
        '@stylistic/plus/indent-binary-ops': ['error', 2],

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
        // replaced by padding-line-between-statements
        '@stylistic/js/lines-around-directive': 'off', // ['error', 'always'],

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

        // https://eslint.style/rules/js/newline-per-chained-call
        '@stylistic/js/newline-per-chained-call': ['error', { ignoreChainWithDepth: 6 }],

        // disallow the omission of parentheses when invoking a constructor with no arguments
        // https://eslint.org/docs/rules/new-parens
        '@stylistic/js/new-parens': 'error',

        // disallow use of bitwise operators
        // https://eslint.org/docs/rules/no-bitwise
        'no-bitwise': 'off',

        // disallow if as the only statement in an else block
        // https://eslint.org/docs/rules/no-lonely-if
        'no-lonely-if': 'error',
        'sukka/unicorn/no-lonely-if': 'error',

        // disallow un-paren'd mixes of different operators
        // https://eslint.org/docs/rules/no-mixed-operators
        '@stylistic/js/no-mixed-operators': ['error', {
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
        'no-multi-assign': 'error',

        // disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
        // https://eslint.org/docs/rules/no-multiple-empty-lines
        '@stylistic/js/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

        // disallow negated conditions
        // https://eslint.org/docs/rules/no-negated-condition
        'no-negated-condition': 'off',
        'sukka/unicorn/no-negated-condition': 'warn',

        // disallow nested ternary expressions
        'no-nested-ternary': 'off', // replaced by sukka/unicorn/no-nested-ternary
        // disallow nested ternary expressions
        'sukka/unicorn/no-nested-ternary': 'warn',

        // disallow use of the Object constructor
        // deprecated and replaced by no-object-constructor
        'no-new-object': 'off',
        // https://eslint.org/docs/latest/rules/no-object-constructor
        'no-object-constructor': 'error',

        'no-array-constructor': 'error',

        // https://eslint.style/rules/js/no-spaced-func
        // replaced by func-call-spacing
        '@stylistic/js/no-spaced-func': 'off',

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
        '@stylistic/js/padding-line-between-statements': [
          'error',
          // add line after
          { blankLine: 'always', prev: 'directive', next: '*' },
          // add line around (both before and after)
          { blankLine: 'always', prev: '*', next: ['class', 'with'] },
          { blankLine: 'always', prev: ['class', 'with'], next: '*' }
        ],

        // https://eslint.style/rules/js/quotes
        '@stylistic/js/quotes': ['error', 'single'],

        // require quotes around object literal property names
        // https://eslint.org/docs/rules/quote-props.html
        '@stylistic/js/quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

        '@stylistic/js/jsx-quotes': ['error', 'prefer-double'],

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

        // Require or disallow spacing between template tags and their literals
        // https://eslint.style/rules/js/template-tag-spacing
        '@stylistic/js/template-tag-spacing': ['error', 'never'],

        // require or disallow the Unicode Byte Order Mark
        // https://eslint.org/docs/rules/unicode-bom
        'unicode-bom': ['error', 'never'],

        // require regex literals to be wrapped in parentheses
        '@stylistic/js/wrap-regex': 'off',

        // disallow labels that share a name with a variable
        // https://eslint.org/docs/rules/no-label-var
        'no-label-var': 'error',

        // disallow use of variables before they are defined
        'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],

        'no-restricted-globals': [
          'error',
          {
            name: 'isFinite',
            message:
              'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite'
          },
          {
            name: 'isNaN',
            message:
              'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan'
          }
        ],
        // disallow use of undefined when initializing variables
        'no-undef-init': 'error',

        'sukka/no-expression-empty-lines': 'error',
        'sukka/prefer-single-boolean-return': 'error',
        'sukka/no-all-duplicated-branches': 'error',
        'sukka/bool-param-default': 'error',
        'sukka/call-argument-line': 'error',
        'sukka/class-prototype': 'warn',
        'sukka/comma-or-logical-or-case': 'error',

        'sukka/array/no-unneeded-flat-map': 'error',
        'sukka/browser/prefer-location-assign': 'warn',
        'sukka/jsx/no-template-literal': 'error',
        'sukka/jsx/no-unneeded-nested': 'error',
        'sukka/string/no-locale-case': 'warn',
        'sukka/string/no-simple-template-literal': 'error',
        'sukka/type/no-instanceof-wrapper': 'error',
        'sukka/unicode/no-bidi': 'warn',
        'sukka/unicode/no-invisible': 'warn',

        'sukka/no-redundant-variable': 'error',
        'sukka/no-single-return': 'error',
        'sukka/prefer-early-return': ['error', { maximumStatements: 16 }],
        'sukka/prefer-fetch': 'error',
        'sukka/prefer-timer-id': 'warn',

        'sukka/unicorn/catch-error-name': ['error', { ignore: [/^(?:e|err|error|\w+Err|\w+Error)[\d_]?$/] }],
        'sukka/unicorn/custom-error-definition': 'error',
        'sukka/unicorn/require-array-join-separator': 'warn',
        'sukka/unicorn/no-thenable': 'error', // export function then()'
        'sukka/unicorn/no-invalid-remove-event-listener': 'error', // removeEventListener('click', f.bind(...))
        'sukka/unicorn/consistent-function-scoping': 'warn', // hoist unnecessary higher order functions
        'sukka/unicorn/prefer-event-target': 'warn',
        'sukka/unicorn/prefer-keyboard-event-key': 'warn',
        'sukka/unicorn/prefer-text-content': 'warn',
        'sukka/unicorn/no-console-spaces': 'warn', // console.log('id: ', id)
        'sukka/unicorn/no-empty-file': 'warn',
        'sukka/unicorn/no-useless-fallback-in-spread': 'warn', // {...(foo || {})}
        'sukka/unicorn/no-useless-length-check': 'warn', // array.length === 0 || array.every(...)
        'sukka/unicorn/no-useless-promise-resolve-reject': 'warn', // return Promise.resolve(value) in async function
        'sukka/unicorn/no-zero-fractions': 'warn', // 1.0
        'sukka/unicorn/prefer-export-from': ['warn', { ignoreUsedVariables: true }], // prefer export { } from than import-and-export
        'sukka/unicorn/prefer-native-coercion-functions': 'warn', // no coercion wrapper v => Boolean(v)
        'sukka/unicorn/prefer-negative-index': 'warn', // arr.slice(arr.length - 1) -> arr.slice(-1)
        'sukka/unicorn/no-document-cookie': 'error', // even if you have to do so, use CookieJar
        'sukka/unicorn/prefer-add-event-listener': 'warn',
        'sukka/unicorn/prefer-array-index-of': 'warn',
        'sukka/unicorn/prefer-blob-reading-methods': 'warn',
        'sukka/unicorn/prefer-date-now': 'warn',
        'sukka/unicorn/prefer-dom-node-dataset': 'warn',
        'sukka/unicorn/prefer-modern-math-apis': 'warn',
        'sukka/unicorn/number-literal-case': 'error', // prefer 0x1 over 0X1
        'sukka/unicorn/prefer-number-properties': ['warn', { checkInfinity: false }],
        'sukka/unicorn/prefer-reflect-apply': 'warn',
        'sukka/unicorn/prefer-set-size': 'warn',
        'sukka/unicorn/prefer-string-replace-all': 'warn', // str.replaceAll(...)
        'sukka/unicorn/prefer-string-slice': 'warn',
        'sukka/unicorn/prefer-string-trim-start-end': 'warn', // str.trimStart(...)
        'sukka/unicorn/no-unreadable-iife': 'warn', // (bar => (bar ? bar.baz : baz))(getBar())
        'sukka/unicorn/throw-new-error': 'warn',
        'sukka/unicorn/escape-case': 'warn', // correct casing of escape '\xA9'
        'sukka/unicorn/no-hex-escape': 'warn', // correct casing of escape '\u001B'
        'sukka/unicorn/prefer-prototype-methods': 'warn', // prefer Array.prototype.slice than [].slice
        // cause problem with alias import (new URL(, import.meta.url))
        // 'sukka/unicorn/relative-url-style': ['warn', 'always'], // prefer relative url starts with ./
        'sukka/unicorn/error-message': 'error', // Pass error message when throwing errors
        'sukka/unicorn/no-instanceof-array': 'error', // Array.isArray
        'sukka/unicorn/prefer-type-error': 'error', // throw new TypeError
        'sukka/unicorn/consistent-destructuring': 'warn',
        'sukka/unicorn/new-for-builtins': 'warn', // prefer new Map([...]) over Map([...])
        'sukka/unicorn/no-array-push-push': 'warn', // array.push(...); array.push(...);
        'sukka/unicorn/no-static-only-class': 'warn', // class Foo { static bar() {} }
        'sukka/unicorn/no-unreadable-array-destructuring': 'error', // [,,,,, bar] = arr;
        'sukka/unicorn/no-useless-spread': 'error', // const foo = undefined;
        'sukka/unicorn/no-useless-switch-case': 'warn', // switch (foo) { case 1: default: return 2; }
        'sukka/unicorn/no-useless-undefined': ['error', { checkArguments: false }], // let foo = undefined;
        'sukka/unicorn/numeric-separators-style': [
          'warn',
          {
            onlyIfContainsSeparator: false,
            number: { minimumDigits: 7, groupLength: 3 },
            binary: { minimumDigits: 9, groupLength: 4 },
            octal: { minimumDigits: 9, groupLength: 4 },
            hexadecimal: { minimumDigits: 5, groupLength: 2 }
          }
        ], // 1_000_000
        'sukka/unicorn/prefer-array-find': 'warn', // arr.filter(x => skk(x))[0];
        'sukka/unicorn/prefer-array-flat-map': 'warn', // arr.map(x => skk(x)).flat();
        'sukka/unicorn/prefer-array-flat': 'warn', // const foo = array.reduce((a, b) => a.concat(b), []);
        'sukka/unicorn/prefer-array-some': 'warn', // arr.findIndex(x => skk(x)) !== -1;
        'sukka/unicorn/prefer-code-point': 'warn', // 'foo'.codePointAt(0)
        'sukka/unicorn/prefer-default-parameters': 'warn', // function foo(bar = 1) {}
        'sukka/unicorn/prefer-logical-operator-over-ternary': 'warn', // foo ? foo : bar
        'sukka/unicorn/prefer-optional-catch-binding': 'error', // try {} catch {}
        'sukka/unicorn/prefer-regexp-test': 'warn', // /foo/.test(bar)
        'sukka/unicorn/prefer-set-has': 'error', // Set#has is way faster
        'sukka/unicorn/prefer-switch': 'warn',
        'sukka/unicorn/require-number-to-fixed-digits-argument': 'warn', // 1.toFixed(2)
        'sukka/import-dedupe': 'error', // ban import { a, b, a, a, c, a } from 'sukka'
        'sukka/unicorn/prefer-string-raw': 'warn', // String.raw`foo\nbar`
        'sukka/unicorn/no-single-promise-in-promise-methods': 'error',
        'sukka/unicorn/no-await-in-promise-methods': 'error',
        'sukka/unicorn/no-magic-array-flat-depth': 'error',
        'sukka/unicorn/no-object-as-default-parameter': 'error',
        'sukka/unicorn/template-indent': [
          'warn',
          {
            tags: [
              'outdent',
              'dedent',
              'gql',
              'sql',
              'html',
              'styled',
              'css'
            ],
            functions: [
              'dedent',
              'stripIndent',
              'strip_indent',
              'stripTags',
              'striptags',
              'strip_tags',
              'stripHtml',
              'stripHTML',
              'strip_html'
            ],
            selectors: [],
            comments: [
              'HTML',
              'html',
              'CSS',
              'css',
              'indent'
            ]
          }
        ],
        'sukka/unicorn/no-negation-in-equality-check': 'error',
        'sukka/unicorn/no-length-as-slice-end': 'error',

        'no-restricted-imports': [
          'error',
          { paths: RESTRICTED_IMPORT_JS }
        ],
        'no-prototype-builtins': 'off',
        'autofix/no-prototype-builtins': 'error'
      }
    }
  ];

  if (disableNoConsoleInCLI !== false) {
    const customGlobs = typeof disableNoConsoleInCLI === 'boolean' ? null : (Array.isArray(disableNoConsoleInCLI) ? disableNoConsoleInCLI : [disableNoConsoleInCLI]);
    configs.push({
      name: '@eslint-sukka/js cli specific',
      files: customGlobs ?? [`**/scripts/${constants.GLOB_SRC}`, `**/cli/${constants.GLOB_SRC}`, `**/cli.${constants.GLOB_SRC_EXT}`],
      rules: {
        'no-console': 'off'
      }
    });
  }

  return configs;
};
