import { GLOB_ALL_JSON, GLOB_YML } from './constants';

export * as constants from './constants';
export { getPackageJson, isDirectDependency } from './get-package-json';
export * from './restricted-import';
export { memo } from './memoize-eslint-plugin';
export type * from './types';

export { createRule, ensureParserWithTypeInformation, isParserWithTypeInformation } from './create-eslint-rule';
export type { RuleModule, ExportedRuleModule, RuleContext } from './create-eslint-rule';

import { EnforceExtension, ResolverFactory } from 'oxc-resolver';
import type { FlatESLintConfigItem } from './types';

import { castArray } from 'foxts/cast-array';
import { appendArrayInPlace } from 'foxts/append-array-in-place';

export const packageResolver = new ResolverFactory({
  extensions: ['.mjs', '.cjs', '.js', '.json', '.node'],
  enforceExtension: EnforceExtension.Auto,
  conditionNames: ['node', 'import', 'require', 'default'],
  mainFields: ['module', 'main'],
  builtinModules: true
});

export function isPackageExists(pkg: string, parent = process.cwd()) {
  const result = packageResolver.sync(parent, pkg);

  return Boolean(result.builtin || result.path);
}

export * as globals from './globals';

export function withFiles(configs: FlatESLintConfigItem, files: string | string[]): FlatESLintConfigItem;
export function withFiles(configs: FlatESLintConfigItem[], files: string | string[]): FlatESLintConfigItem[];
export function withFiles(configs: FlatESLintConfigItem | FlatESLintConfigItem[], files: string | string[]) {
  files = castArray(files);

  if (!Array.isArray(configs)) {
    configs.files = files;
    return configs;
  }

  for (let i = 0, len = configs.length; i < len; i++) {
    configs[i].files = files;
  }

  return configs;
}

export function withIgnores(configs: FlatESLintConfigItem, ignores: string | string[]): FlatESLintConfigItem;
export function withIgnores(configs: FlatESLintConfigItem[], ignores: string | string[]): FlatESLintConfigItem[];
export function withIgnores(configs: FlatESLintConfigItem | FlatESLintConfigItem[], ignores: string | string[]) {
  ignores = castArray(ignores);

  if (!Array.isArray(configs)) {
    if (configs.ignores) {
      appendArrayInPlace(configs.ignores, ignores);
    } else if (Object.isExtensible(configs)) {
      configs.ignores = ignores;
    } else {
      configs = {
        ...configs,
        ignores
      };
    }
    return configs;
  }

  for (let i = 0, len = configs.length; i < len; i++) {
    if (configs[i].ignores) {
      appendArrayInPlace(configs[i].ignores!, ignores);
    } else if (Object.isExtensible(configs[i])) {
      configs[i].ignores = ignores;
    } else {
      configs[i] = {
        ...configs[i],
        ignores
      };
    }
  }

  return configs;
}

const GLOB_NON_JS_TS = [
  ...GLOB_ALL_JSON,
  ...GLOB_YML
];
/**
 * This ignores JSON and YAML files from config item(s). USE WITH CAUTION.
 *
 * Markdown file is not excluded, so that @eslint/markdown can lint codeblocks within markdown files
 *
 * Most of the rules should be run with JSON/YAML files, because:
 *
 * JSON files are not excluded, so stylistic rules, other text-based rules like "eol-last", do run on them (powered by eslint-plugin-jsonc and jsonc-eslint-parser)
 * YAML file is not excluded, so stylistic rules, other text-based rules like "eol-last", do run on YAML files (powered by eslint-plugin-yml and yaml-eslint-parser)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention -- UNSAFE_
export function UNSAFE_excludeJsonYamlFiles(configs: FlatESLintConfigItem): FlatESLintConfigItem;
// eslint-disable-next-line @typescript-eslint/naming-convention -- UNSAFE_
export function UNSAFE_excludeJsonYamlFiles(configs: FlatESLintConfigItem[]): FlatESLintConfigItem[];
// eslint-disable-next-line @typescript-eslint/naming-convention -- UNSAFE_
export function UNSAFE_excludeJsonYamlFiles(configs: FlatESLintConfigItem | FlatESLintConfigItem[]): FlatESLintConfigItem | FlatESLintConfigItem[] {
  return withIgnores(configs as any, GLOB_NON_JS_TS);
}
