import type { FlatESLintConfigItem } from '@eslint-sukka/shared';
// @ts-expect-error -- no types available
import eslint_plugin_promise from 'eslint-plugin-promise';

export const promise = (): FlatESLintConfigItem[] => {
  return [{
    name: 'sukka/promise',
    plugins: {
      promise: eslint_plugin_promise
    },
    rules: {
      'promise/always-return': [
        'error',
        {
          ignoreLastCallback: true
        }
      ],
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': [
        'error',
        {
          allowFinally: true,
          terminationMethod: ['catch', 'asCallback', 'finally']
        }
      ],
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'warn',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn'
    }
  }];
};
