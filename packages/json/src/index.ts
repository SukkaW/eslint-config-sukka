import eslint_plugin_jsonc from 'eslint-plugin-jsonc';

import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import { constants } from '@eslint-sukka/shared';

import { SHARED_OPTIONS } from './shared-option';
import { sortPackageJson } from './sort-package-json';
import { sortTsconfigJson } from './sort-tsconfig-json';

import type { Linter } from 'eslint';

const SHARED_RULES: Linter.RulesRecord = {
  'jsonc/array-bracket-spacing': ['error', 'never'],
  'jsonc/comma-dangle': ['error', 'never'],
  'jsonc/comma-style': ['error', 'last'],
  'jsonc/indent': ['error', 2],
  'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
  'jsonc/object-curly-newline': 'off', // ['error', { consistent: true, multiline: true }],
  'jsonc/object-curly-spacing': ['error', 'always'],
  'jsonc/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
  'jsonc/quote-props': 'error',
  'jsonc/quotes': 'error'
};

export const jsonc = (): FlatESLintConfigItem[] => {
  return [
    ...eslint_plugin_jsonc.configs['flat/base'],
    {
      files: [constants.GLOB_JSON],
      rules: {
        ...eslint_plugin_jsonc.configs['flat/recommended-with-json'].reduce((acc, cur) => ({ ...acc, ...cur.rules }), {}),
        ...SHARED_RULES
      }
    },
    {
      ...SHARED_OPTIONS,
      files: [constants.GLOB_JSON5],
      rules: {
        ...eslint_plugin_jsonc.configs['flat/recommended-with-json5'].reduce((acc, cur) => ({ ...acc, ...cur.rules }), {}),
        ...SHARED_RULES
      }
    },
    {
      ...SHARED_OPTIONS,
      files: [constants.GLOB_JSONC],
      rules: {
        ...eslint_plugin_jsonc.configs['flat/recommended-with-jsonc'].reduce((acc, cur) => ({ ...acc, ...cur.rules }), {}),
        ...SHARED_RULES
      }
    },
    // package.json
    sortPackageJson,
    // tsconfig.json
    sortTsconfigJson
  ];
};
