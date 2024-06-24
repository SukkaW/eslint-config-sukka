import { memo, type FlatESLintConfigItem } from '@eslint-sukka/shared';
// @ts-expect-error -- no types available
import eslint_plugin_comments from 'eslint-plugin-eslint-comments';
import eslint_plugin_sukka from 'eslint-plugin-sukka';

export const comment = (): FlatESLintConfigItem[] => {
  return [{
    name: 'antfu/eslint-comments/rules',
    plugins: {
      'eslint-comments': eslint_plugin_comments,
      sukka: memo(eslint_plugin_sukka, 'eslint-plugin-sukka')
    },
    rules: {
      'sukka/ban-eslint-disable': ['error', 'allow-with-description'],

      'eslint-comments/no-aggregating-enable': 'error',
      'eslint-comments/no-duplicate-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'error',
      // ESLint officially supports no unused disable comments via reportUnusedDisableDirectives
      'eslint-comments/no-unused-disable': 'off',
      'eslint-comments/no-unused-enable': 'error'
    }
  }];
};
