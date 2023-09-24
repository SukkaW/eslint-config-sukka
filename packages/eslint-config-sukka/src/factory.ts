import type { FlatESLintConfigItem } from 'eslint-define-config';
import { ignores } from './modules/ignores';

import { isPackageExists } from 'local-pkg';

interface ESLineSukkaOptions {
  ignores?: string | string[],
  typescript?: boolean
}

export const sukka = (options: ESLineSukkaOptions, ...userConfig: FlatESLintConfigItem[]): FlatESLintConfigItem[] => {
  const configs: FlatESLintConfigItem[] = [];

  configs.push(...ignores(options.ignores ?? []));

  const enableTypeScript = options.typescript ?? isPackageExists('typescript');

  if (enableTypeScript) {
    configs.push(...require('./modules/typescript'));
  }
};
