import { best_practices, errors, es6, style, variables, sukka } from '@eslint-sukka/shared';
import { FlatESLintConfigItem } from 'eslint-define-config';

// @ts-expect-error -- no types
import eslintJs from '@eslint/js';

export const base = (): FlatESLintConfigItem[] => {
  return [
    eslintJs.configs.recommended,
    {
      plugins: {
        ...best_practices.plugins,
        ...errors.plugins,
        ...es6.plugins,
        ...style.plugins,
        ...variables.plugins,
        ...sukka.plugins
      },
      rules: {
        ...best_practices.rules,
        ...errors.rules,
        ...es6.rules,
        ...style.rules,
        ...variables.rules,
        ...sukka.rules
      }
    }]
};
