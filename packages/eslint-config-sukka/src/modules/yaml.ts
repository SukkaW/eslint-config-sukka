import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import eslint_plugin_yaml from 'eslint-plugin-yml';

export function yaml(): FlatESLintConfigItem[] {
  return eslint_plugin_yaml.configs['flat/recommended'];
}
