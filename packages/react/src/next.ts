import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import { configs as eslint_plugin_next_flatconfig } from '@next/eslint-plugin-next';

export function next(): FlatESLintConfigItem[] {
  return [{
    ...eslint_plugin_next_flatconfig['core-web-vitals'],
    files: [
      constants.GLOB_TS,
      constants.GLOB_TSX,
      // constants.GLOB_JS,
      constants.GLOB_JSX
    ],
    rules: {
      ...eslint_plugin_next_flatconfig['core-web-vitals'].rules,
      '@next/next/no-img-element': 'off'
    }
  }];
}
