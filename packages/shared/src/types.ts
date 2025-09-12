import type { Linter } from 'eslint';

export type FlatESLintConfigItem = Linter.Config;
export type SukkaESLintRuleConfig = Pick<FlatESLintConfigItem, 'plugins' | 'rules'>;

export type ESLintRulesRecord = Linter.RulesRecord;
