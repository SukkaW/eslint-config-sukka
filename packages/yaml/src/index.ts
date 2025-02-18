import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import eslint_plugin_yml from 'eslint-plugin-yml';

export function yaml(): FlatESLintConfigItem[] {
  const cfg = eslint_plugin_yml.configs['flat/recommended'];
  if (Array.isArray(cfg)) {
    return cfg;
  }

  return [cfg as any];
}
