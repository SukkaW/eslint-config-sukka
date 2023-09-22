import type { FlatESLintConfigItem } from 'eslint-define-config';
import sukkaPlugin from 'eslint-plugin-sukka';

export const sukka: FlatESLintConfigItem = {
  plugins: {
    sukka: sukkaPlugin
  },
  rules: {
    'sukka/array/no-unneeded-flat-map': 'error',
    'sukka/browser/prefer-location-assign': 'warn',
    'sukka/jsx/no-template-literal': 'error',
    'sukka/jsx/no-unneeded-nested': 'error',
    'sukka/string/no-locale-case': 'warn',
    'sukka/string/no-simple-template-literal': 'error',
    'sukka/type/no-instanceof-wrapper': 'error',
    'sukka/unicode/no-bidi': 'warn',
    'sukka/unicode/no-invisible': 'warn',
    'sukka/ban-eslint-disable': ['error', 'allow-with-description'],
    'sukka/no-redundant-variable': 'error',
    'sukka/no-single-return': 'error',
    'sukka/prefer-early-return': ['error', { maximumStatements: 16 }],
    'sukka/prefer-fetch': 'error',
    'sukka/prefer-timer-id': 'warn',

    'sukka/unicorn/require-array-join-separator': 'warn',
    'sukka/unicorn/no-thenable': 'error', // export function then()'
    'sukka/unicorn/no-invalid-remove-event-listener': 'error', // removeEventListener('click', f.bind(...))
    'sukka/unicorn/consistent-function-scoping': 'warn', // hoist unnecessary higher order functions
    'sukka/unicorn/prefer-event-target': 'warn',
    'sukka/unicorn/prefer-keyboard-event-key': 'warn',
    'sukka/unicorn/prefer-text-content': 'warn',
    'sukka/unicorn/no-console-spaces': 'warn', // console.log('id: ', id)
    'sukka/unicorn/no-empty-file': 'warn',
    'sukka/unicorn/no-useless-fallback-in-spread': 'warn', // {...(foo || {})}
    'sukka/unicorn/no-useless-length-check': 'warn', // array.length === 0 || array.every(...)
    'sukka/unicorn/no-useless-promise-resolve-reject': 'warn', // return Promise.resolve(value) in async function
    'sukka/unicorn/no-zero-fractions': 'warn', // 1.0
    'sukka/unicorn/prefer-export-from': 'warn', // prefer export { } from than import-and-export
    'sukka/unicorn/prefer-native-coercion-functions': 'warn', // no coercion wrapper v => Boolean(v)
    'sukka/unicorn/no-document-cookie': 'error', // even if you have to do so, use CookieJar
    'sukka/unicorn/prefer-add-event-listener': 'warn',
    'sukka/unicorn/prefer-array-index-of': 'warn',
    'sukka/unicorn/prefer-blob-reading-methods': 'warn',
    'sukka/unicorn/prefer-date-now': 'warn',
    'sukka/unicorn/prefer-dom-node-dataset': 'warn',
    'sukka/unicorn/prefer-math-trunc': 'warn',
    'sukka/unicorn/prefer-modern-dom-apis': 'warn',
    'sukka/unicorn/prefer-modern-math-apis': 'warn',
    'sukka/unicorn/prefer-number-properties': 'warn',
    'sukka/unicorn/prefer-reflect-apply': 'warn',
    'sukka/unicorn/prefer-set-size': 'warn',
    'sukka/unicorn/prefer-string-replace-all': 'warn', // str.replaceAll(...)
    'sukka/unicorn/prefer-string-slice': 'warn',
    'sukka/unicorn/prefer-string-trim-start-end': 'warn', // str.trimStart(...)
    'sukka/unicorn/no-unreadable-iife': 'warn', // (bar => (bar ? bar.baz : baz))(getBar())
    'sukka/unicorn/throw-new-error': 'warn',
    'sukka/unicorn/better-regex': 'error', // RegEx
    'sukka/unicorn/escape-case': 'warn', // correct casing of escape '\xA9'
    'sukka/unicorn/no-hex-escape': 'warn', // correct casing of escape '\u001B'
    'sukka/unicorn/prefer-prototype-methods': 'warn', // prefer Array.prototype.slice than [].slice
    'sukka/unicorn/relative-url-style': ['warn', 'always'], // prefer relative url starts with ./
  }
};
