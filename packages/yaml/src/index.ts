import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import eslint_plugin_yml from 'eslint-plugin-yml';

export function yaml(): FlatESLintConfigItem[] {
  const myCfg: FlatESLintConfigItem[] = [
    {
      files: ['*.yaml', '**/*.yaml', '*.yml', '**/*.yml'],
      rules: {
        // FIXME: https://github.com/ota-meshi/eslint-plugin-yml/issues/277
        '@stylistic/js/spaced-comment': 'off'
      }
    },
    {
      files: ['pnpm-workspace.yaml'],
      name: 'sukka/yaml/pnpm-workspace',
      rules: {
        'yml/sort-keys': [
          'error',
          {
            order: [
              'packages',
              'overrides',
              'patchedDependencies',
              'hoistPattern',
              'catalog',
              'catalogs',

              'allowedDeprecatedVersions',
              'allowNonAppliedPatches',
              'configDependencies',
              'ignoredBuiltDependencies',
              'ignoredOptionalDependencies',
              'neverBuiltDependencies',
              'onlyBuiltDependencies',
              'onlyBuiltDependenciesFile',
              'packageExtensions',
              'peerDependencyRules',
              'supportedArchitectures'
            ],
            pathPattern: '^$'
          }
        ]
      }
    },
    {

    }
  ];

  const cfg = eslint_plugin_yml.configs['flat/recommended'];
  if (Array.isArray(cfg)) {
    return [...cfg, ...myCfg];
  }

  return [cfg as FlatESLintConfigItem, ...myCfg];
}
