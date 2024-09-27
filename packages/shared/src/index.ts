import type { Linter } from 'eslint';

export * as constants from './constants';
export { getPackageJson } from './get-package-json';
export * from './restricted-import';
export { memo } from './memoize-eslint-plugin';
export type * from './types';

export { createRule, ensureParserWithTypeInformation } from './create-eslint-rule';
export type { RuleModule, ExportedRuleModule, RuleContext } from './create-eslint-rule';

import { resolve as importMetaResolve } from '@dual-bundle/import-meta-resolve';
import type { ErrnoException } from '@dual-bundle/import-meta-resolve';

export const isPackageExists = (pkg: string) => {
  try {
    importMetaResolve(pkg, import.meta.url);
    return true;
  } catch (error) {
    const e = error as ErrnoException;
    if (e.code !== 'MODULE_NOT_FOUND') {
      console.error('[@eslint-sukka/shared: isPackageExists]', e);
    }

    throw error;
  }
};

export { importMetaResolve };

export * as globals from './globals';

export const ruleopt = <S extends Linter.RuleSeverity, Options extends unknown[] = unknown[]>(
  severity: S,
  ...opt: Options
): Linter.RuleEntry<Options> => (opt.length ? [severity, ...opt] as const : severity);
