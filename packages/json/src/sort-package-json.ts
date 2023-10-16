import { SHARED_OPTIONS } from './shared-option';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
export const sortPackageJson: FlatESLintConfigItem = {
  ...SHARED_OPTIONS,
  files: ['**/package.json'],
  rules: {
    'jsonc/sort-array-values': [
      'error',
      {
        order: { type: 'asc' },
        pathPattern: '^files$'
      }
    ],
    'jsonc/sort-keys': [
      'error',
      {
        order: [
          '$schema',
          'publisher',
          'name',
          'displayName',
          'version',
          'private',
          'description',
          'funding',
          'homepage',
          'repository',
          'bugs',
          'categories',
          'type',
          'main',
          'module',
          'types',
          'typesVersions',
          'bin',
          'files',
          'exports',
          'icon',
          'unpkg',
          'jsdelivr',
          'sideEffects',
          'activationEvents',
          'contributes',
          'scripts',
          'keywords',
          'author',
          'license',
          'dependencies',
          'devDependencies',
          'peerDependencies',
          'peerDependenciesMeta',
          'optionalDependencies',
          'packageManager',
          'engines',
          'pnpm',
          'overrides',
          'resolutions',
          'husky',
          'simple-git-hooks',
          'lint-staged',
          'eslintConfig'
        ],
        pathPattern: '^$'
      },
      {
        order: { type: 'asc' },
        pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$'
      },
      // {
      //   order: { type: 'asc' },
      //   pathPattern: '^resolutions$'
      // },
      // {
      //   order: { type: 'asc' },
      //   pathPattern: '^pnpm.overrides$'
      // },
      {
        order: [
          'types',
          'import',
          'module',
          'require',
          'default'
        ],
        pathPattern: '^exports.*$'
      }
    ]
  }
};
