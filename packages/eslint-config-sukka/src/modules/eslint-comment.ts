import { memo } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
// @ts-expect-error -- no types
import eslint_plugin_eslint_comments from '@eslint-community/eslint-plugin-eslint-comments';
import eslint_plugin_sukka from 'eslint-plugin-sukka';

export const comment = (): FlatESLintConfigItem[] => [{
  name: 'sukka/eslint-comments',
  plugins: {
    '@eslint-community/eslint-comments': eslint_plugin_eslint_comments,
    sukka: memo(eslint_plugin_sukka, 'eslint-plugin-sukka')
  },
  rules: {
    'sukka/ban-eslint-disable': ['error', 'allow-with-description'],

    '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    '@eslint-community/eslint-comments/no-aggregating-enable': 'error',
    '@eslint-community/eslint-comments/no-duplicate-disable': 'error',
    '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
    '@eslint-community/eslint-comments/no-unused-disable': 'error',
    '@eslint-community/eslint-comments/no-unused-enable': 'error'
  }
}];
