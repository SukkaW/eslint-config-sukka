import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

// @ts-expect-error -- missing -types
import eslint_plugin_next from '@next/eslint-plugin-next';

export function next(): FlatESLintConfigItem[] {
  return [{
    plugins: {
      '@next/next': eslint_plugin_next
    },
    files: [
      constants.GLOB_TS,
      constants.GLOB_TSX,
      // constants.GLOB_JS,
      constants.GLOB_JSX
    ],
    rules: {
      ...eslint_plugin_next.configs.recommended.rules,
      ...eslint_plugin_next.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'off'
    }
  }];
}
