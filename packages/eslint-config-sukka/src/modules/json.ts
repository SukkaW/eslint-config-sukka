import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import { constants, collectRules } from '@eslint-sukka/shared';

export async function json(): Promise<FlatESLintConfigItem[]> {
  const SHARED_OPTIONS: Pick<FlatESLintConfigItem, 'plugins' | 'languageOptions'> = {
    languageOptions: {
      parser: await import('jsonc-eslint-parser')
    }
  };

  const eslint_plugin_jsonc = await import('eslint-plugin-jsonc');

  return [
    ...eslint_plugin_jsonc.configs.base,
    {
      name: '@eslint-sukka/json shared rules',
      files: [constants.GLOB_JSON, constants.GLOB_JSON5, constants.GLOB_JSONC],
      rules: {
        'jsonc/array-bracket-spacing': ['error', 'never'],
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/comma-style': ['error', 'last'],
        'jsonc/indent': ['error', 2],
        'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
        'jsonc/object-curly-newline': 'off', // ['error', { consistent: true, multiline: true }],
        'jsonc/object-curly-spacing': ['error', 'always'],
        'jsonc/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
        'jsonc/quote-props': 'error',
        'jsonc/quotes': 'error'
      }
    },
    {
      name: '@eslint-sukka/json json',
      ...SHARED_OPTIONS,
      files: [constants.GLOB_JSON],
      rules: collectRules(eslint_plugin_jsonc.configs['recommended-with-json'])
    },
    {
      name: '@eslint-sukka/json json5',
      ...SHARED_OPTIONS,
      files: [constants.GLOB_JSON5],
      rules: collectRules(eslint_plugin_jsonc.configs['recommended-with-json5'])
    },
    {
      name: '@eslint-sukka/json jsonc',
      ...SHARED_OPTIONS,
      files: [constants.GLOB_JSONC],
      rules: collectRules(eslint_plugin_jsonc.configs['recommended-with-jsonc'])
    },
    // package.json
    {
      name: '@eslint-sukka/json package.json',
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
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$'
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
    },
    // tsconfig.json
    {
      name: '@eslint-sukka/json tsconfig.json',
      ...SHARED_OPTIONS,
      files: ['**/tsconfig.json', '**/tsconfig.*.json', '**/tsconfig-*.json', '**/jsconfig.json', '**/jsconfig.*.json', '**/jsconfig-*.json'],
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              '$schema',
              'extends',
              'compilerOptions',
              'references',
              'files',
              'include',
              'exclude'
            ],
            pathPattern: '^$'
          },
          {
            order: [
              /* Projects */
              'incremental',
              'composite',
              'tsBuildInfoFile',
              'disableSourceOfProjectReferenceRedirect',
              'disableSolutionSearching',
              'disableReferencedProjectLoad',
              /* Language and Environment */
              'target',
              'lib',
              'jsx',
              'experimentalDecorators',
              'emitDecoratorMetadata',
              'jsxFactory',
              'jsxFragmentFactory',
              'jsxImportSource',
              'reactNamespace',
              'noLib',
              'useDefineForClassFields',
              'moduleDetection',
              /* Modules */
              'module',
              'rootDir',
              'moduleResolution',
              'baseUrl',
              'paths',
              'rootDirs',
              'typeRoots',
              'types',
              'allowUmdGlobalAccess',
              'moduleSuffixes',
              'allowImportingTsExtensions',
              'resolvePackageJsonExports',
              'resolvePackageJsonImports',
              'customConditions',
              'resolveJsonModule',
              'allowArbitraryExtensions',
              'noResolve',
              /* JavaScript Support */
              'allowJs',
              'checkJs',
              'maxNodeModuleJsDepth',
              /* Emit */
              'declaration',
              'declarationMap',
              'emitDeclarationOnly',
              'sourceMap',
              'inlineSourceMap',
              'outFile',
              'outDir',
              'removeComments',
              'noEmit',
              'importHelpers',
              'importsNotUsedAsValues',
              'downlevelIteration',
              'sourceRoot',
              'mapRoot',
              'inlineSources',
              'emitBOM',
              'newLine',
              'stripInternal',
              'noEmitHelpers',
              'noEmitOnError',
              'preserveConstEnums',
              'declarationDir',
              'preserveValueImports',
              /* Interop Constraints */
              'isolatedModules',
              'verbatimModuleSyntax',
              'allowSyntheticDefaultImports',
              'esModuleInterop',
              'preserveSymlinks',
              'forceConsistentCasingInFileNames',
              /* Type Checking */
              'strict',
              'strictBindCallApply',
              'strictFunctionTypes',
              'strictNullChecks',
              'strictPropertyInitialization',
              'allowUnreachableCode',
              'allowUnusedLabels',
              'alwaysStrict',
              'exactOptionalPropertyTypes',
              'noFallthroughCasesInSwitch',
              'noImplicitAny',
              'noImplicitOverride',
              'noImplicitReturns',
              'noImplicitThis',
              'noPropertyAccessFromIndexSignature',
              'noUncheckedIndexedAccess',
              'noUnusedLocals',
              'noUnusedParameters',
              'useUnknownInCatchVariables',
              /* Completeness */
              'skipDefaultLibCheck',
              'skipLibCheck'
            ],
            pathPattern: '^compilerOptions$'
          }
        ]
      }
    }
  ];
}
