import eslint_plugin_jsonc from 'eslint-plugin-jsonc';

import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import { constants } from '@eslint-sukka/shared';

import { SHARED_OPTIONS } from './shared-option';
import { sortPackageJson } from './sort-package-json';
import { sortTsconfigJson } from './sort-tsconfig-json';

import type { Linter } from 'eslint';

const RULES_BASE = eslint_plugin_jsonc.configs.base.overrides.map((override) => override.rules).reduce((prev, curr) => ({ ...prev, ...curr }), {});

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
    {
      ...SHARED_OPTIONS,
      files: [constants.GLOB_JSON],
      rules: {
        ...RULES_BASE,
        ...eslint_plugin_jsonc.configs['recommended-with-json'].rules as any,
        ...SHARED_RULES
      }
    },
    {
      ...SHARED_OPTIONS,
      files: [constants.GLOB_JSON5],
      rules: {
        ...RULES_BASE,
        ...eslint_plugin_jsonc.configs['recommended-with-json5'].rules as any,
        ...SHARED_RULES
      }
    },
    {
      ...SHARED_OPTIONS,
      files: [constants.GLOB_JSONC],
      rules: {
        ...RULES_BASE,
        ...eslint_plugin_jsonc.configs['recommended-with-jsonc'].rules as any,
        ...SHARED_RULES
      }
    },
    // package.json
    sortPackageJson,
    // tsconfig.json
    sortTsconfigJson
  ];
};
