import eslint_plugin_sukka from 'eslint-plugin-sukka';

import { memo, type FlatESLintConfigItem } from '@eslint-sukka/shared';
import * as eslint_plugin_regexp from 'eslint-plugin-regexp';
import { configs as eslint_pluin_regexp_configs } from 'eslint-plugin-regexp';

export const regexp = (): FlatESLintConfigItem[] => [{
  name: 'sukka/regexp',
  plugins: {
    sukka: memo(eslint_plugin_sukka, 'eslint-plugin-sukka'),
    regexp: memo(eslint_plugin_regexp, 'eslint-plugin-regexp')
  },
  rules: {
    'sukka/unicorn/better-regex': 'error', // RegEx[]
    ...eslint_pluin_regexp_configs['flat/recommended'].rules,
    'regexp/strict': 'off' // we accepts Annex B regex from better-regex
  }
}];
