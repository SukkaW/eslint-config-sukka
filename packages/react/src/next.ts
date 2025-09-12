import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem, ESLintRulesRecord } from '@eslint-sukka/shared';

import { flatConfig as eslint_plugin_next_flatconfig } from '@next/eslint-plugin-next';

export function next(): FlatESLintConfigItem[] {
  return [{
    ...eslint_plugin_next_flatconfig.coreWebVitals as any,
    files: [
      constants.GLOB_TS,
      constants.GLOB_TSX,
      // constants.GLOB_JS,
      constants.GLOB_JSX
    ],
    rules: {
      ...eslint_plugin_next_flatconfig.coreWebVitals.rules as ESLintRulesRecord,
      '@next/next/no-img-element': 'off'
    }
  }];
}
