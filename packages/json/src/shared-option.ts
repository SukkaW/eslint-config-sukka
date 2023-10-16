import eslint_plugin_jsonc from 'eslint-plugin-jsonc';
import jsonc_eslint_parser from 'jsonc-eslint-parser';

export const SHARED_OPTIONS = {
  plugins: {
    jsonc: eslint_plugin_jsonc as any
  },
  languageOptions: {
    parser: jsonc_eslint_parser as any
  }
};
