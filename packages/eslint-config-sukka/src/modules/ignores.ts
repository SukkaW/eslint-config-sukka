import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
import eslint_config_flat_gitignore from 'eslint-config-flat-gitignore';

export interface OptionsIgnores {
  customGlobs?: string | string[] | null | false | ((builtinGlobs: typeof constants.GLOB_EXCLUDE) => string[]),
  gitignore?: string | string[] | boolean | null
}

export const ignores = (options: OptionsIgnores = {}): FlatESLintConfigItem[] => {
  const {
    customGlobs = null,
    gitignore = ['.gitignore']
  } = options;
  const configs: FlatESLintConfigItem[] = [];

  let ignores: string[] = [];
  if (customGlobs === false || customGlobs === null) {
    ignores = constants.GLOB_EXCLUDE;
  } else if (typeof customGlobs === 'function') {
    ignores = customGlobs(constants.GLOB_EXCLUDE);
  } else if (typeof customGlobs === 'string') {
    ignores.push(customGlobs);
  } else if (Array.isArray(customGlobs)) {
    ignores = customGlobs;
  } else {
    const _typeguard: never = customGlobs;
  }
  configs.push({ ignores });

  if (gitignore === false || gitignore === null) {
    // do nothing
  } else if (gitignore === true) {
    configs.push(eslint_config_flat_gitignore({ files: ['.gitignore'], strict: false }));
  } else if (typeof gitignore === 'string' || Array.isArray(gitignore)) {
    configs.push(eslint_config_flat_gitignore({ files: gitignore, strict: false }));
  } else {
    const _typeguard: never = gitignore;
  }

  return configs;
};
