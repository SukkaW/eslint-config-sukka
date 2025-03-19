import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

// @ts-expect-error -- missing -types
import eslint_plugin_next from '@next/eslint-plugin-next';

export function next(): FlatESLintConfigItem[] {
  return [{
    ...eslint_plugin_next.flatConfig.coreWebVitals,
    files: [
      constants.GLOB_TS,
      constants.GLOB_TSX,
      // constants.GLOB_JS,
      constants.GLOB_JSX
    ],
    rules: {
      ...eslint_plugin_next.flatConfig.coreWebVitals.rules,
      '@next/next/no-img-element': 'warn'
    }
  }];
}
