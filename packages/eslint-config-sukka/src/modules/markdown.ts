import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import { default as eslint_markdown } from '@eslint/markdown';

export function markdown(): FlatESLintConfigItem[] {
  return eslint_markdown.configs.recommended;
}
