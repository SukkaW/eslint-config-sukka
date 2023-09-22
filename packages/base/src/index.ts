import { best_practices, errors, es6, style, variables, sukka } from '@eslint-sukka/shared';

export default {
  extends: ['eslint:recommended'],
  plugins: Array.from(new Set([
    ...best_practices.plugins,
    ...errors.plugins,
    ...es6.plugins,
    ...style.plugins,
    ...variables.plugins,
    ...sukka.plugins
  ])),
  rules: {
    ...best_practices.rules,
    ...errors.rules,
    ...es6.rules,
    ...style.rules,
    ...variables.rules,
    ...sukka.rules
  }
};
