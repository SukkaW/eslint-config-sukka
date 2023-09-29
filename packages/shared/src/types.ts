import type { Linter } from 'eslint';

export type FlatESLintConfigItem = Linter.FlatConfig;
export type SukkaESLintRuleConfig = Pick<FlatESLintConfigItem, 'plugins' | 'rules'>;
