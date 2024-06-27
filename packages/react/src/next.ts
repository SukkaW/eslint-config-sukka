import { constants, type FlatESLintConfigItem } from '@eslint-sukka/shared';

import { fixupPluginRules } from '@eslint/compat';

// @ts-expect-error -- missing -types
import eslint_plugin_next from '@next/eslint-plugin-next';

export const next = (): FlatESLintConfigItem[] => {
  return [{
    plugins: {
      '@next/next': fixupPluginRules(eslint_plugin_next)
    },
    files: [
      constants.GLOB_TS,
      constants.GLOB_TSX,
      // constants.GLOB_JS,
      constants.GLOB_JSX
    ],
    rules: {
      ...eslint_plugin_next.configs.recommended.rules,
      ...eslint_plugin_next.configs['core-web-vitals'].rules
    }
  }];
};
