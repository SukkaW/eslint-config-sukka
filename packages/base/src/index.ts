import { rules } from '@eslint-sukka/shared';

export default {
  extends: ['eslint:recommended'],
  rules: {
    ...rules.best_practices,
    ...rules.errors,
    ...rules.es6,
    ...rules.style,
    ...rules.variables
  }
};
