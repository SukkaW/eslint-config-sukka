// This file is generated by scripts/codegen.ts
// DO NOT EDIT THIS FILE MANUALLY
import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';

export const generated_overrides: SukkaESLintRuleConfig = {
  rules: {
    "no-dupe-class-members": "off",
    "@typescript-eslint/no-dupe-class-members": "error",
    "no-loss-of-precision": "off",
    "@typescript-eslint/no-loss-of-precision": "warn",
    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": "error",
    "class-methods-use-this": "off",
    "@typescript-eslint/class-methods-use-this": [
      "error",
      {
        "exceptMethods": []
      }
    ],
    "default-param-last": "off",
    "@typescript-eslint/default-param-last": "error",
    "dot-notation": "off",
    "@typescript-eslint/dot-notation": [
      "error",
      {
        "allowKeywords": true
      }
    ],
    "no-implied-eval": "off",
    "@typescript-eslint/no-implied-eval": "error",
    "no-invalid-this": "off",
    "@typescript-eslint/no-invalid-this": "off",
    "no-loop-func": "off",
    "@typescript-eslint/no-loop-func": "error",
    "no-return-await": "off",
    "@typescript-eslint/return-await": "error",
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        "allowShortCircuit": false,
        "allowTernary": false,
        "allowTaggedTemplates": false
      }
    ],
    "prefer-promise-reject-errors": "off",
    "@typescript-eslint/prefer-promise-reject-errors": [
      "error",
      {
        "allowEmptyReject": true
      }
    ],
    "require-await": "off",
    "@typescript-eslint/require-await": "off",
    "@stylistic/js/no-extra-parens": "off",
    "@stylistic/ts/no-extra-parens": [
      "off",
      "all",
      {
        "conditionalAssign": true,
        "nestedBinaryExpressions": false,
        "returnAssign": false,
        "ignoreJSX": "all",
        "enforceForArrowConditionals": false
      }
    ],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "@stylistic/js/block-spacing": "off",
    "@stylistic/ts/block-spacing": [
      "error",
      "always"
    ],
    "@stylistic/js/brace-style": "off",
    "@stylistic/ts/brace-style": [
      "error",
      "1tbs",
      {
        "allowSingleLine": true
      }
    ],
    "camelcase": "off",
    "@stylistic/js/comma-dangle": "off",
    "@stylistic/ts/comma-dangle": [
      "error",
      "never"
    ],
    "@stylistic/js/comma-spacing": "off",
    "@stylistic/ts/comma-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    "@stylistic/js/func-call-spacing": "off",
    "@stylistic/ts/func-call-spacing": [
      "error",
      "never"
    ],
    "@stylistic/js/indent": "off",
    "@stylistic/ts/indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "@stylistic/js/key-spacing": "off",
    "@stylistic/ts/key-spacing": [
      "error",
      {
        "beforeColon": false,
        "afterColon": true
      }
    ],
    "@stylistic/js/keyword-spacing": "off",
    "@stylistic/ts/keyword-spacing": [
      "error",
      {
        "before": true,
        "after": true,
        "overrides": {
          "return": {
            "after": true
          },
          "throw": {
            "after": true
          },
          "case": {
            "after": true
          }
        }
      }
    ],
    "@stylistic/js/lines-around-comment": "off",
    "@stylistic/ts/lines-around-comment": "off",
    "@stylistic/js/lines-between-class-members": "off",
    "@stylistic/ts/lines-between-class-members": [
      "error",
      "always",
      {
        "exceptAfterSingleLine": true
      }
    ],
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "error",
    "@stylistic/js/object-curly-spacing": "off",
    "@stylistic/ts/object-curly-spacing": [
      "error",
      "always"
    ],
    "@stylistic/js/padding-line-between-statements": "off",
    "@stylistic/ts/padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "directive",
        "next": "*"
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": [
          "class",
          "with"
        ]
      },
      {
        "blankLine": "always",
        "prev": [
          "class",
          "with"
        ],
        "next": "*"
      }
    ],
    "@stylistic/js/quotes": "off",
    "@stylistic/ts/quotes": [
      "error",
      "single"
    ],
    "@stylistic/js/quote-props": "off",
    "@stylistic/ts/quote-props": [
      "error",
      "as-needed",
      {
        "keywords": false,
        "unnecessary": true,
        "numbers": false
      }
    ],
    "@stylistic/js/semi": "off",
    "@stylistic/ts/semi": [
      "error",
      "always"
    ],
    "@stylistic/js/space-before-blocks": "off",
    "@stylistic/ts/space-before-blocks": "error",
    "@stylistic/js/space-before-function-paren": "off",
    "@stylistic/ts/space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }
    ],
    "@stylistic/js/space-infix-ops": "off",
    "@stylistic/ts/space-infix-ops": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        "functions": false,
        "classes": true,
        "variables": true
      }
    ],
    "no-restricted-imports": "off"
  }
};