import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import { default as eslint_markdown } from '@eslint/markdown';

export function markdown(): FlatESLintConfigItem[] {
  const eslint_markdown_config = eslint_markdown.configs.recommended;
  return Array.isArray(eslint_markdown_config)
    ? eslint_markdown_config
    : [
      eslint_markdown_config as any
    ];
}
