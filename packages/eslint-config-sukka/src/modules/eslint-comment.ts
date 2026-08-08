import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import { memo } from '@eslint-sukka/shared';
import eslint_plugin_eslint_comments from '@eslint-community/eslint-plugin-eslint-comments';
import eslint_plugin_sukka from '@eslint-sukka/eslint-plugin-sukka-full';
import { eslint_plugin_vibe_proof } from 'eslint-plugin-vibe-proof';

export function comment(): FlatESLintConfigItem[] {
  return [
    {
      name: 'sukka/eslint-comments',
      plugins: {
        '@eslint-community/eslint-comments': eslint_plugin_eslint_comments,
        sukka: memo(eslint_plugin_sukka, '@eslint-sukka/eslint-plugin-sukka-full'),
        'vibe-proof': memo(eslint_plugin_vibe_proof, 'eslint-plugin-vibe-proof')
      },
      rules: {
        '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
        '@eslint-community/eslint-comments/no-aggregating-enable': 'error',
        '@eslint-community/eslint-comments/no-duplicate-disable': 'error',
        '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
        '@eslint-community/eslint-comments/no-unused-enable': 'error',

        'vibe-proof/ban-eslint-disable': ['error', 'allow-with-description'],
        'sukka/migrate-vibe-proof-eslint-disable': 'error'
      }
    }
  ];
}
