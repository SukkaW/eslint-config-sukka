import { memo } from '@eslint-sukka/shared';
import eslint_plugin_jsonc from 'eslint-plugin-jsonc';
import jsonc_eslint_parser from 'jsonc-eslint-parser';

export const SHARED_OPTIONS = {
  plugins: {
    jsonc: memo<any>(eslint_plugin_jsonc, 'eslint-plugin-jsonc')
  },
  languageOptions: {
    parser: jsonc_eslint_parser as any
  }
};
