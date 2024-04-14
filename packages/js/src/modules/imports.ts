import { RESTRICTED_IMPORT_JS, memo } from '@eslint-sukka/shared';
import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';
// @ts-expect-error -- no types
import eslint_plugin_unused_imports from 'eslint-plugin-unused-imports';
import eslint_plugin_import_x from 'eslint-plugin-import-x';

export const imports: SukkaESLintRuleConfig = {
  plugins: {
    'unused-imports': memo(eslint_plugin_unused_imports, 'eslint-plugin-unused-imports'),
    'import-x': memo(eslint_plugin_import_x, 'eslint-plugin-import-x') as any
  },
  rules: {
    ...eslint_plugin_import_x.configs.recommended.rules,
    'no-restricted-imports': [
      'error',
      { paths: RESTRICTED_IMPORT_JS }
    ],
    'unused-imports/no-unused-imports': 'warn'
  }
};
