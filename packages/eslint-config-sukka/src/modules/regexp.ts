import eslint_plugin_sukka from '@eslint-sukka/eslint-plugin-sukka-full';

import { UNSAFE_excludeJsonYamlFiles } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

export async function regexp(): Promise<FlatESLintConfigItem[]> {
  const { configs: eslint_pluin_regexp_configs } = await import('eslint-plugin-regexp');

  // this is safe because JSON/YAML files won't have parsable regexes
  return UNSAFE_excludeJsonYamlFiles([
    eslint_plugin_sukka.configs.regexp,
    eslint_pluin_regexp_configs['flat/recommended'],
    {
      name: 'sukka/regexp',
      rules: {
        'regexp/strict': 'off' // we accepts Annex B regex from better-regex
      }
    }
  ]);
}
