export * as constants from './constants';
export { getPackageJson, isDirectDependency } from './get-package-json';
export * from './restricted-import';
export { memo } from './memoize-eslint-plugin';
export type * from './types';

export { createRule, ensureParserWithTypeInformation, isParserWithTypeInformation } from './create-eslint-rule';
export type { RuleModule, ExportedRuleModule, RuleContext } from './create-eslint-rule';

import { EnforceExtension, ResolverFactory } from 'oxc-resolver';

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
