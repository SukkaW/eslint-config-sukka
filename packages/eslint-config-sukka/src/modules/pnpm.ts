import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import eslint_plugin_pnpm from 'eslint-plugin-pnpm';
import * as jsoncParser from 'jsonc-eslint-parser';

export function pnpm(): FlatESLintConfigItem[] {
  return [{
    name: '@eslint-sukka pnpm/package.json',
    files: ['**/package.json'],
    languageOptions: {
      parser: jsoncParser
    },
    plugins: {
      pnpm: eslint_plugin_pnpm
    },
    rules: {
      'pnpm/json-enforce-catalog': 'off',
      'pnpm/json-valid-catalog': 'error',
      'pnpm/json-prefer-workspace-settings': 'error'
    }
  }];
};
