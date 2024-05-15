import { SHARED_OPTIONS } from './shared-option';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
export const sortTsconfigJson: FlatESLintConfigItem = {
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
};
