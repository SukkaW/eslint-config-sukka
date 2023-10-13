import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';
import eslint_plugin_sukka from 'eslint-plugin-sukka';

export const sukka: SukkaESLintRuleConfig = {
  plugins: {
    sukka: eslint_plugin_sukka
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
    'sukka/unicorn/prefer-export-from': ['warn', { ignoreUsedVariables: true }], // prefer export { } from than import-and-export
    'sukka/unicorn/prefer-native-coercion-functions': 'warn', // no coercion wrapper v => Boolean(v)
    'sukka/unicorn/no-document-cookie': 'error', // even if you have to do so, use CookieJar
    'sukka/unicorn/prefer-add-event-listener': 'warn',
    'sukka/unicorn/prefer-array-index-of': 'warn',
    'sukka/unicorn/prefer-blob-reading-methods': 'warn',
    'sukka/unicorn/prefer-date-now': 'warn',
    'sukka/unicorn/prefer-dom-node-dataset': 'warn',
    'sukka/unicorn/prefer-modern-math-apis': 'warn',
    'sukka/unicorn/number-literal-case': 'error', // prefer 0x1 over 0X1
    'sukka/unicorn/prefer-number-properties': ['warn', { checkInfinity: false }],
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

    // cause problem with alias import (new URL(, import.meta.url))
    // 'sukka/unicorn/relative-url-style': ['warn', 'always'], // prefer relative url starts with ./

    'sukka/unicorn/error-message': 'error', // Pass error message when throwing errors
    'sukka/unicorn/no-instanceof-array': 'error', // Array.isArray
    'sukka/unicorn/prefer-type-error': 'error', // throw new TypeError
    'sukka/unicorn/consistent-destructuring': 'warn',
    'sukka/unicorn/new-for-builtins': 'warn', // prefer new Map([...]) over Map([...])
    'sukka/unicorn/no-array-method-this-argument': 'warn', // bar.find(e => skk(e), ctx);
    'sukka/unicorn/no-array-push-push': 'warn', // array.push(...); array.push(...);
    'sukka/unicorn/no-static-only-class': 'warn', // class Foo { static bar() {} }
    'sukka/unicorn/no-unreadable-array-destructuring': 'error', // [,,,,, bar] = arr;
    'sukka/unicorn/no-useless-spread': 'warn', // const foo = undefined;
    'sukka/unicorn/no-useless-switch-case': 'warn', // switch (foo) { case 1: default: return 2; }
    'sukka/unicorn/no-useless-undefined': ['error', { checkArguments: false }], // let foo = undefined;
    'sukka/unicorn/numeric-separators-style': [
      'warn',
      {
        onlyIfContainsSeparator: false,
        number: { minimumDigits: 7, groupLength: 3 },
        binary: { minimumDigits: 9, groupLength: 4 },
        octal: { minimumDigits: 9, groupLength: 4 },
        hexadecimal: { minimumDigits: 5, groupLength: 2 }
      }
    ], // 1_000_000
    'sukka/unicorn/prefer-array-find': 'warn', // arr.filter(x => skk(x))[0];
    'sukka/unicorn/prefer-array-flat-map': 'warn', // arr.map(x => skk(x)).flat();
    'sukka/unicorn/prefer-array-flat': 'warn', // const foo = array.reduce((a, b) => a.concat(b), []);
    'sukka/unicorn/prefer-array-some': 'warn', // arr.findIndex(x => skk(x)) !== -1;
    'sukka/unicorn/prefer-code-point': 'warn', // 'foo'.codePointAt(0)
    'sukka/unicorn/prefer-default-parameters': 'warn', // function foo(bar = 1) {}
    'sukka/unicorn/prefer-logical-operator-over-ternary': 'warn', // foo ? foo : bar
    'sukka/unicorn/prefer-optional-catch-binding': 'error', // try {} catch {}
    'sukka/unicorn/prefer-regexp-test': 'warn', // /foo/.test(bar)
    'sukka/unicorn/prefer-set-has': 'error', // Set#has is way faster
    'sukka/unicorn/prefer-switch': 'warn', // Array.from(foo)
    'sukka/unicorn/require-number-to-fixed-digits-argument': 'warn', // 1.toFixed(2)
    'sukka/import-dedupe': 'error' // ban import { a, b, a, a, c, a } from 'sukka'
  }
};
