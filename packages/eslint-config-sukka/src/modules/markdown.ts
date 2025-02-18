import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import eslint_markdown from '@eslint/markdown';

export function markdown(): FlatESLintConfigItem[] {
  return [
    eslint_markdown.configs.recommended as FlatESLintConfigItem
  ];
}
