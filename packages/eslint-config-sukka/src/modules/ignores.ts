import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from 'eslint-define-config';

export const ignores = (customGlobs: string | string[] | null = null): FlatESLintConfigItem[] => {
  return [{
    ignores: customGlobs === null
      ? constants.GLOB_EXCLUDE
      : (Array.isArray(customGlobs) ? customGlobs : [customGlobs])
  }];
};
