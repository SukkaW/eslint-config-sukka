import type { FlatESLintConfigItem } from 'eslint-define-config';
import sukkaPlugin from 'eslint-plugin-sukka';

export const sukkaTypeScript: FlatESLintConfigItem = {
  plugins: {
    sukka: sukkaPlugin
  },
  rules: {
    'sukka/string/no-unneeded-to-string': 'error',
    // If you have a good reason to do this, please ignore this error and provide a comment about why this is type safe.
    'sukka/type/no-force-cast-via-top-type': 'error',
    'sukka/type/no-wrapper-type-reference': 'error',
    'sukka/no-default-error': 'off' // disable since this is way too slow
  }
};
