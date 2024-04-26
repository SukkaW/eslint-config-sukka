import module from './index';
import { runTest } from '../../../../../lib/eslint-plugin-tester';

runTest({
  module,
  *valid() {
    yield `
      function f(s: string[]) {
        s[0] === "a"
      }
    `;
    yield `
      function f(s: string) {
        s[0] + "a"
      }
    `;
    yield `
      function f(s: string) {
        s[1] === "a"
      }
    `;
    yield `
      function f(s: string | string[]) {
        s[0] === "a"
      }
    `;
    yield `
      function f(s: any) {
        s[0] === "a"
      }
    `;
    yield `
      function f<T>(s: T) {
        s[0] === "a"
      }
    `;
    yield `
      function f(s: string[]) {
        s[s.length - 1] === "a"
      }
    `;
    yield `
      function f(s: string) {
        s[s.length - 2] === "a"
      }
    `;
    yield `
      function f(s: string[]) {
        s.charAt(0) === "a"
      }
    `;
    yield `
      function f(s: string) {
        s.charAt(0) + "a"
      }
    `;
    yield `
      function f(s: string) {
        s.charAt(1) === "a"
      }
    `;
    yield `
      function f(s: string) {
        s.charAt() === "a"
      }
    `;
    yield `
      function f(s: string[]) {
        s.charAt(s.length - 1) === "a"
      }
    `;
    yield `
      function f(a: string, b: string, c: string) {
        (a + b).charAt((a + c).length - 1) === "a"
      }
    `;
    yield `
      function f(a: string, b: string, c: string) {
        (a + b).charAt(c.length - 1) === "a"
      }
    `;
    yield `
      function f(s: string[]) {
        s.indexOf(needle) === 0
      }
    `;
    yield `
      function f(s: string | string[]) {
        s.indexOf(needle) === 0
      }
    `;
    yield `
      function f(s: string) {
        s.indexOf(needle) === s.length - needle.length
      }
    `;
    yield `
      function f(s: string[]) {
        s.lastIndexOf(needle) === s.length - needle.length
      }
    `;
    yield `
      function f(s: string) {
        s.lastIndexOf(needle) === 0
      }
    `;
    yield `
      function f(s: string) {
        s.match(/^foo/)
      }
    `;
    yield `
      function f(s: string) {
        s.match(/foo$/)
      }
    `;
    yield `
      function f(s: string) {
        s.match(/^foo/) + 1
      }
    `;
    yield `
      function f(s: string) {
        s.match(/foo$/) + 1
      }
    `;
    yield `
      function f(s: { match(x: any): boolean }) {
        s.match(/^foo/) !== null
      }
    `;
    yield `
      function f(s: { match(x: any): boolean }) {
        s.match(/foo$/) !== null
      }
    `;
    yield `
      function f(s: string) {
        s.match(/foo/) !== null
      }
    `;
    yield `
      function f(s: string) {
        s.match(/^foo$/) !== null
      }
    `;
    yield `
      function f(s: string) {
        s.match(/^foo./) !== null
      }
    `;
    yield `
      function f(s: string) {
        s.match(/^foo|bar/) !== null
      }
    `;
    yield `
      function f(s: string) {
        s.match(new RegExp("")) !== null
      }
    `;
    yield `
      function f(s: string) {
        s.match(pattern) !== null // cannot check '^'/'$'
      }
    `;
    yield `
      function f(s: string) {
        s.match(new RegExp("^/!{[", "u")) !== null // has syntax error
      }
    `;
    yield `
      function f(s: string) {
        s.match() !== null
      }
    `;
    yield `
      function f(s: string) {
        s.match(777) !== null
      }
    `;
    yield `
      function f(s: string[]) {
        s.slice(0, needle.length) === needle
      }
    `;
    yield `
      function f(s: string[]) {
        s.slice(-needle.length) === needle
      }
    `;
    yield `
      function f(s: string) {
        s.slice(1, 4) === "bar"
      }
    `;
    yield `
      function f(s: string) {
        s.slice(-4, -1) === "bar"
      }
    `;
    // https://github.com/typescript-eslint/typescript-eslint/issues/1690
    yield `
      function f(s: string) {
        s.slice(1) === "bar"
      }
    `;
    yield `
      function f(s: string) {
        pattern.test(s)
      }
    `;
    yield `
      function f(s: string) {
        /^bar/.test()
      }
    `;
    yield `
      function f(x: { test(): void }, s: string) {
        x.test(s)
      }
    `;
    yield `
      function f(s: string) {
        s.slice(0, -4) === "car"
      }
    `;
    yield `
      function f(x: string, s: string) {
        x.endsWith('foo') && x.slice(0, -4) === 'bar'
      }
    `;
    yield `
      function f(s: string) {
        s[0] === "a"
      }
    `;
    yield `
      function f(s: string) {
        s[0] !== "a"
      }
    `;
    yield `
      function f(s: string) {
        s[0] == "a"
      }
    `;
    yield `
    function f(s: string) {
      s[0] != "a"
    }
    `;
    yield `
    function f(s: string) {
      (s)[0] === ("a")
    }
    `;
    yield `
      function f(s: string) {
        s.slice(0, length) === needle // the 'length' can be different to 'needle.length'
      }
    `;
    yield `
      function f(s: string) {
        s.slice(-length) === needle // 'length' can be different
      }
    `;
    yield `
      function f(s: string) {
        s.slice(0, 3) === needle
      }
    `;
  },
  *invalid() {
    yield {
      code: `
        function f(s: string) {
          s[0] === "あ"
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("あ")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s[0] === "👍" // the length is 2.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string, t: string) {
          s[0] === t // the length of t is unknown.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s[s.length - 1] === "a"
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("a")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    // String#charAt
    yield {
      code: `
        function f(s: string) {
          s.charAt(0) === "a"
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.charAt(0) !== "a"
        }
      `,
      output: `
        function f(s: string) {
          !s.startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.charAt(0) == "a"
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.charAt(0) != "a"
        }
      `,
      output: `
        function f(s: string) {
          !s.startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.charAt(0) === "あ"
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("あ")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.charAt(0) === "👍" // the length is 2.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string, t: string) {
          s.charAt(0) === t // the length of t is unknown.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.charAt(s.length - 1) === "a"
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("a")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          (s).charAt(0) === "a"
        }
      `,
      output: `
        function f(s: string) {
          (s).startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };

    // String#indexOf
    yield {
      code: `
        function f(s: string) {
          s.indexOf(needle) === 0
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.indexOf(needle) !== 0
        }
      `,
      output: `
        function f(s: string) {
          !s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.indexOf(needle) == 0
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.indexOf(needle) != 0
        }
      `,
      output: `
        function f(s: string) {
          !s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };

    // String#lastIndexOf
    yield {
      code: `
        function f(s: string) {
          s.lastIndexOf("bar") === s.length - 3
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.lastIndexOf("bar") !== s.length - 3
        }
      `,
      output: `
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.lastIndexOf("bar") == s.length - 3
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.lastIndexOf("bar") != s.length - 3
        }
      `,
      output: `
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.lastIndexOf("bar") === s.length - "bar".length
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.lastIndexOf(needle) === s.length - needle.length
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };

    // String#match
    yield {
      code: `
        function f(s: string) {
          s.match(/^bar/) !== null
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.match(/^bar/) != null
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.match(/bar$/) !== null
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.match(/bar$/) != null
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.match(/^bar/) === null
        }
      `,
      output: `
        function f(s: string) {
          !s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.match(/^bar/) == null
        }
      `,
      output: `
        function f(s: string) {
          !s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.match(/bar$/) === null
        }
      `,
      output: `
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.match(/bar$/) == null
        }
      `,
      output: `
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        const pattern = /^bar/
        function f(s: string) {
          s.match(pattern) != null
        }
      `,
      output: `
        const pattern = /^bar/
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        const pattern = new RegExp("^bar")
        function f(s: string) {
          s.match(pattern) != null
        }
      `,
      output: `
        const pattern = new RegExp("^bar")
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        const pattern = /^"quoted"/
        function f(s: string) {
          s.match(pattern) != null
        }
      `,
      output: `
        const pattern = /^"quoted"/
        function f(s: string) {
          s.startsWith("\\"quoted\\"")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };

    // String#slice
    yield {
      code: `
        function f(s: string) {
          s.slice(0, 3) === "bar"
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(0, 3) !== "bar"
        }
      `,
      output: `
        function f(s: string) {
          !s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(0, 3) == "bar"
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(0, 3) != "bar"
        }
      `,
      output: `
        function f(s: string) {
          !s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(0, needle.length) === needle
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(0, needle.length) == needle // hating implicit type conversion
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(-3) === "bar"
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(-3) !== "bar"
        }
      `,
      output: `
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(-needle.length) === needle
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.slice(s.length - needle.length) === needle
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.substring(0, 3) === "bar"
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.substring(-3) === "bar" // the code is probably mistake.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          s.substring(s.length - 3, s.length) === "bar"
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };

    // RegExp#test
    yield {
      code: `
        function f(s: string) {
          /^bar/.test(s)
        }
      `,
      output: `
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          /bar$/.test(s)
        }
      `,
      output: `
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: `
        const pattern = /^bar/
        function f(s: string) {
          pattern.test(s)
        }
      `,
      output: `
        const pattern = /^bar/
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        const pattern = new RegExp("^bar")
        function f(s: string) {
          pattern.test(s)
        }
      `,
      output: `
        const pattern = new RegExp("^bar")
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        const pattern = /^"quoted"/
        function f(s: string) {
          pattern.test(s)
        }
      `,
      output: `
        const pattern = /^"quoted"/
        function f(s: string) {
          s.startsWith("\\"quoted\\"")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f(s: string) {
          /^bar/.test(a + b)
        }
      `,
      output: `
        function f(s: string) {
          (a + b).startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };

    // Test for variation of string types.
    yield {
      code: `
        function f(s: "a" | "b") {
          s.indexOf(needle) === 0
        }
      `,
      output: `
        function f(s: "a" | "b") {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        function f<T extends "a" | "b">(s: T) {
          s.indexOf(needle) === 0
        }
      `,
      output: `
        function f<T extends "a" | "b">(s: T) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: `
        type SafeString = string & {__HTML_ESCAPED__: void}
        function f(s: SafeString) {
          s.indexOf(needle) === 0
        }
      `,
      output: `
        type SafeString = string & {__HTML_ESCAPED__: void}
        function f(s: SafeString) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
  }
});
