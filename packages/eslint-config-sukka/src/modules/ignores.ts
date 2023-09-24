import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from 'eslint-define-config';

export const ignores = (customGlobs: string | string[] = []): FlatESLintConfigItem[] => {
  const customGlobsArray = Array.isArray(customGlobs) ? customGlobs : [customGlobs];
  return [{
    ignores: [
      ...constants.GLOB_EXCLUDE,
      ...customGlobsArray
    ]
  }];
};
