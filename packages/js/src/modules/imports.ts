import { RESTRICTED_IMPORT_JS, memo } from '@eslint-sukka/shared';
import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';
// @ts-expect-error -- no types
import eslint_plugin_unused_imports from 'eslint-plugin-unused-imports';
// @ts-expect-error -- no types
import eslint_plugin_i from 'eslint-plugin-import';

export const imports: SukkaESLintRuleConfig = {
  plugins: {
    'unused-imports': memo(eslint_plugin_unused_imports, 'eslint-plugin-unused-imports'),
    i: memo(eslint_plugin_i, 'eslint-plugin-i'),
    import: memo(eslint_plugin_i, 'eslint-plugin-i') // legacy alias
  },
  rules: {
    ...eslint_plugin_i.configs.recommended.rules,
    'no-restricted-imports': [
      'error',
      { paths: RESTRICTED_IMPORT_JS }
    ],
    'unused-imports/no-unused-imports': 'warn'
  }
};
