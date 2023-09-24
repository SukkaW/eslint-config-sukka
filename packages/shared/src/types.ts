import type { FlatESLintConfigItem } from 'eslint-define-config';

export type SukkaESLintRuleConfig = Pick<FlatESLintConfigItem, 'plugins' | 'rules'>;
