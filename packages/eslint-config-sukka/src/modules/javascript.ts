import eslint_js from '@eslint/js';
import { memo, RESTRICTED_IMPORT_JS, constants, globals, getPackageJson, withFiles, UNSAFE_excludeJsonYamlFiles } from '@eslint-sukka/shared';

import eslint_plugin_unused_imports from 'eslint-plugin-unused-imports';
import eslint_plugin_import_x, { createNodeResolver } from 'eslint-plugin-import-x';
import eslint_plugin_sukka from '@eslint-sukka/eslint-plugin-sukka-full';
import eslint_plugin_demorgan from 'eslint-plugin-de-morgan';

// import eslint_plugin_no_secrets from 'eslint-plugin-no-secrets';

import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

export interface OptionsJavaScript {
  module?: boolean,
  /**
   * Apply the config to specific files. Default to eslint default.
   *
   * @default undefined
   */
  files?: string | string[] | undefined | null,
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

export async function javascript(options: OptionsJavaScript = {}): Promise<FlatESLintConfigItem[]> {
  const {
    files,
    disableNoConsoleInCLI = true,
    env = {}
  } = options;
  const { browser = true, webextensions = false, greasemonkey = false, customGlobals = {} } = env;

  const isModule = options.module ?? (getPackageJson()?.type === 'module');

  const { default: eslint_plugin_antfu } = await import('eslint-plugin-antfu');

  const configs: FlatESLintConfigItem[] = [
    {
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
        reportUnusedInlineConfigs: 'warn'
      }
    },
    eslint_js.configs.recommended,
    withFiles({
      name: '@eslint-sukka/js base',
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
      plugins: {
        'unused-imports': memo(eslint_plugin_unused_imports, 'eslint-plugin-unused-imports'),
        sukka: memo(eslint_plugin_sukka, '@eslint-sukka/eslint-plugin-sukka-full'),
        antfu: eslint_plugin_antfu
      },
      rules: {
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
        'no-caller': 'error',

        // Disallow returning value in constructor
        // https://eslint.org/docs/rules/no-constructor-return
        'no-constructor-return': 'error',

        'no-else-return': 'off',

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
        'no-proto': 'error',

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
        'no-useless-catch': 'error', // TODO: contribute autofix to upstream

        // disallow useless string concatenation
        // https://eslint.org/docs/rules/no-useless-concat
        'no-useless-concat': 'error', // TODO: contribute autofix to upstream

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
        radix: 'error', // TODO: contribute autofix to upstream

        // require `await` in `async function`
        // https://eslint.org/docs/rules/require-await
        'require-await': 'error',

        'require-yield': 'error',

        // Enforce the use of u flag on RegExp
        // https://eslint.org/docs/rules/require-unicode-regexp
        'require-unicode-regexp': 'off',

        // requires to declare all vars on top of their containing scope
        'vars-on-top': 'error',

        // require or disallow Yoda conditions
        yoda: 'error',

        // Disallow await inside of loops
        // https://eslint.org/docs/rules/no-await-in-loop
        'no-await-in-loop': 'warn',

        // disallow use of console
        'no-console': 'warn',

        // disallow use of constant expressions in conditions
        'no-constant-condition': ['warn', { checkLoops: 'allExceptWhileTrue' }],

        'no-empty-function': 'error',
        'no-empty': ['error', { allowEmptyCatch: true }],

        // Disallows expressions where the operation doesn't affect the value
        // https://eslint.org/docs/rules/no-constant-binary-expression
        'no-constant-binary-expression': 'error',

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

        'no-unassigned-vars': 'error',
        'no-useless-assignment': 'warn',

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
        'valid-typeof': ['error', { requireStringLiterals: true }], // TODO: contribute autofix to upstream

        // Disallow new operators with global non-constructor functions
        // https://eslint.org/docs/latest/rules/no-new-native-nonconstructor
        'no-new-native-nonconstructor': 'error',

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
          allowNamedFunctions: true, // React.memo() and similar wrapper utilities would like to have named functions
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

        // require camel case names
        camelcase: ['warn', {
          properties: 'never',
          ignoreDestructuring: false,
          ignoreImports: true,
          ignoreGlobals: true,
          allow: ['^UNSAFE_', '^experimental_', '^__DEV__']
        }],

        // enforces consistent naming when capturing the current execution context
        'consistent-this': 'off',

        // require a capital letter for constructors
        'new-cap': ['error', {
          newIsCap: true,
          newIsCapExceptions: [],
          capIsNew: false,
          capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List']
        }],

        // disallow use of bitwise operators
        // https://eslint.org/docs/rules/no-bitwise
        'no-bitwise': 'off',

        // disallow if as the only statement in an else block
        // https://eslint.org/docs/rules/no-lonely-if
        'no-lonely-if': 'error',

        // disallow use of chained assignment expressions
        // https://eslint.org/docs/rules/no-multi-assign
        'no-multi-assign': 'error',

        // disallow negated conditions
        // https://eslint.org/docs/rules/no-negated-condition
        'no-negated-condition': 'off',

        // disallow use of the Object constructor
        // deprecated and replaced by no-object-constructor
        'no-new-object': 'off',
        // https://eslint.org/docs/latest/rules/no-object-constructor
        'no-object-constructor': 'error',

        'no-array-constructor': 'error',

        // disallow the use of ternary operators
        'no-ternary': 'off',

        'no-unneeded-ternary': 'error',

        // Disallow the use of Math.pow in favor of the ** operator
        // https://eslint.org/docs/rules/prefer-exponentiation-operator
        'prefer-exponentiation-operator': 'error',

        // require or disallow the Unicode Byte Order Mark
        // https://eslint.org/docs/rules/unicode-bom
        'unicode-bom': ['error', 'never'],

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

        'no-restricted-imports': [
          'error',
          { paths: RESTRICTED_IMPORT_JS }
        ],
        'no-prototype-builtins': 'error', // TODO: contribute autofix to upstream

        'antfu/import-dedupe': 'error', // ban import { a, b, a, a, c, a } from 'sukka'
        'antfu/consistent-chaining': 'error',
        'antfu/no-top-level-await': 'error',
        'antfu/top-level-function': 'warn'
      }
    }, files),
    withFiles(UNSAFE_excludeJsonYamlFiles(eslint_plugin_sukka.configs.recommended_unicorn), files),
    // As one of the maintainer of eslint-plugin-import-x, I know how rule works. JSON/YAML won't have import syntax
    withFiles(UNSAFE_excludeJsonYamlFiles({
      plugins: {
        'import-x': eslint_plugin_import_x
      },
      settings: {
        'import-x/extensions': allExtensions,
        'import-x/resolver-next': [
          createNodeResolver({
            extensions: allExtensions
          })
        ]
      },
      rules: {
        ...eslint_plugin_import_x.configs['flat/recommended'].rules,
        'import-x/newline-after-import': ['error', { considerComments: false }],
        'import-x/no-absolute-path': 'error',
        'import-x/no-empty-named-blocks': 'error',
        'import-x/no-mutable-exports': 'error',
        'import-x/no-useless-path-segments': 'warn',
        'import-x/no-webpack-loader-syntax': 'error',
        // prevent monorepo sibling imports
        'import-x/no-relative-packages': 'warn'
      }
    }), files),
    withFiles(eslint_plugin_demorgan.configs.recommended, files),
    withFiles(eslint_plugin_sukka.configs.recommended, files)
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
}
