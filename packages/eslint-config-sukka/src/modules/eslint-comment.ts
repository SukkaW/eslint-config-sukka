import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import eslint_plugin_eslint_comments from '@eslint-community/eslint-plugin-eslint-comments';
import eslint_plugin_sukka from '@eslint-sukka/eslint-plugin-sukka-full';

export function comment(): FlatESLintConfigItem[] {
  return [
    eslint_plugin_sukka.configs.comment,
    {
      name: 'sukka/eslint-comments',
      plugins: {
        '@eslint-community/eslint-comments': eslint_plugin_eslint_comments
      },
      rules: {
        '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
        '@eslint-community/eslint-comments/no-aggregating-enable': 'error',
        '@eslint-community/eslint-comments/no-duplicate-disable': 'error',
        '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
        '@eslint-community/eslint-comments/no-unused-disable': 'error',
        '@eslint-community/eslint-comments/no-unused-enable': 'error'
      }
    }
  ];
}
