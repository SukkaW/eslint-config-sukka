import { memo } from '@eslint-sukka/shared';
import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';

// @ts-expect-error -- no types
import eslint_plugin_unused_imports from 'eslint-plugin-unused-imports';
import stylisticJs from '@stylistic/eslint-plugin-js';

export const errors: SukkaESLintRuleConfig = {
  plugins: {
    'unused-imports': memo(eslint_plugin_unused_imports, 'eslint-plugin-unused-imports'),
    '@stylistic/js': memo(stylisticJs, '@stylistic/eslint-plugin-js')
  },
  rules: {
  // Disallow await inside of loops
  // https://eslint.org/docs/rules/no-await-in-loop
    'no-await-in-loop': 'warn',

    // disallow use of console
    'no-console': 'warn',

    // disallow use of constant expressions in conditions
    'no-constant-condition': 'warn',

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

    // replaced by unused-imports/no-unused-vars
    'no-unused-vars': 'off', /* ['error', {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }], */
    'unused-imports/no-unused-vars': [
      'error',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true }
    ],

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
    'use-isnan': 'warn',

    // ensure JSDoc comments are valid
    // https://eslint.org/docs/rules/valid-jsdoc
    'valid-jsdoc': 'off',

    // ensure that the results of typeof are compared against a valid string
    // https://eslint.org/docs/rules/valid-typeof
    'valid-typeof': ['error', { requireStringLiterals: true }],

    // Disallow new operators with global non-constructor functions
    // https://eslint.org/docs/latest/rules/no-new-native-nonconstructor
    'no-new-native-nonconstructor': 'error'
  }
};
