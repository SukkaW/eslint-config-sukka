import { RESTRICTED_IMPORT_JS } from '@eslint-sukka/shared';
import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';
// @ts-expect-error -- no types
import eslint_plugin_unused_imports from 'eslint-plugin-unused-imports';
// @ts-expect-error -- no types
import eslint_plugin_i from 'eslint-plugin-i';

export const imports: SukkaESLintRuleConfig = {
  plugins: {
    'unused-imports': eslint_plugin_unused_imports,
    i: eslint_plugin_i,
    import: eslint_plugin_i // legacy alias
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
