import type { Linter } from 'eslint';

export * as constants from './constants';
export { getPackageJson } from './get-package-json';
export * from './restricted-import';
export { memo } from './memoize-eslint-plugin';
export type * from './types';

export { createRule, ensureParserWithTypeInformation } from './create-eslint-rule';
export type { RuleModule, ExportedRuleModule, RuleContext } from './create-eslint-rule';

export { resolve as importMetaResolve } from '@dual-bundle/import-meta-resolve';

export const ruleopt = <S extends Linter.RuleLevel, Options extends any[] = any[]>(
  severity: S,
  ...opt: Options
): Linter.RuleEntry<Options> => (opt.length ? [severity, ...opt] as const : severity);
