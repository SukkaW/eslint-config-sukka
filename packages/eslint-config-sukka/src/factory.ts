import type { FlatESLintConfigItem } from 'eslint-define-config';
import { ignores } from './modules/ignores';

import { isPackageExists } from 'local-pkg';

interface ESLineSukkaOptions {
  isInEditor?: boolean,
  ignores?: string[] | string
}

export const sukka = (options: ESLineSukkaOptions, ...userConfig: FlatESLintConfigItem[]): FlatESLintConfigItem[] => {
  const isInEditor = options.isInEditor ?? !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE) && !process.env.CI);

  const configs: FlatESLintConfigItem[] = [];

  configs.push(...ignores(options.ignores ?? []));

  configs.push(...userConfig);
};
