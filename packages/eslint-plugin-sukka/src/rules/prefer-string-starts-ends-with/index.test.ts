import module from './index';
import { runTest } from '@eslint-sukka/internal';
import { dedent } from 'ts-dedent';

runTest({
  module,
  *valid() {
    yield dedent`
      function f(s: string[]) {
        s[0] === "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s[0] + "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s[1] === "a"
      }
    `;
    yield dedent`
      function f(s: string | string[]) {
        s[0] === "a"
      }
    `;
    yield dedent`
      function f(s: any) {
        s[0] === "a"
      }
    `;
    yield dedent`
      function f<T>(s: T) {
        s[0] === "a"
      }
    `;
    yield dedent`
      function f(s: string[]) {
        s[s.length - 1] === "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s[s.length - 2] === "a"
      }
    `;
    yield dedent`
      function f(s: string[]) {
        s.charAt(0) === "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s.charAt(0) + "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s.charAt(1) === "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s.charAt() === "a"
      }
    `;
    yield dedent`
      function f(s: string[]) {
        s.charAt(s.length - 1) === "a"
      }
    `;
    yield dedent`
      function f(a: string, b: string, c: string) {
        (a + b).charAt((a + c).length - 1) === "a"
      }
    `;
    yield dedent`
      function f(a: string, b: string, c: string) {
        (a + b).charAt(c.length - 1) === "a"
      }
    `;
    yield dedent`
      function f(s: string[]) {
        s.indexOf(needle) === 0
      }
    `;
    yield dedent`
      function f(s: string | string[]) {
        s.indexOf(needle) === 0
      }
    `;
    yield dedent`
      function f(s: string) {
        s.indexOf(needle) === s.length - needle.length
      }
    `;
    yield dedent`
      function f(s: string[]) {
        s.lastIndexOf(needle) === s.length - needle.length
      }
    `;
    yield dedent`
      function f(s: string) {
        s.lastIndexOf(needle) === 0
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(/^foo/)
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(/foo$/)
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(/^foo/) + 1
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(/foo$/) + 1
      }
    `;
    yield dedent`
      function f(s: { match(x: any): boolean }) {
        s.match(/^foo/) !== null
      }
    `;
    yield dedent`
      function f(s: { match(x: any): boolean }) {
        s.match(/foo$/) !== null
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(/foo/) !== null
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(/^foo$/) !== null
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(/^foo./) !== null
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(/^foo|bar/) !== null
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(new RegExp("")) !== null
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(pattern) !== null // cannot check '^'/'$'
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(new RegExp("^/!{[", "u")) !== null // has syntax error
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match() !== null
      }
    `;
    yield dedent`
      function f(s: string) {
        s.match(777) !== null
      }
    `;
    yield dedent`
      function f(s: string[]) {
        s.slice(0, needle.length) === needle
      }
    `;
    yield dedent`
      function f(s: string[]) {
        s.slice(-needle.length) === needle
      }
    `;
    yield dedent`
      function f(s: string) {
        s.slice(1, 4) === "bar"
      }
    `;
    yield dedent`
      function f(s: string) {
        s.slice(-4, -1) === "bar"
      }
    `;
    // https://github.com/typescript-eslint/typescript-eslint/issues/1690
    yield dedent`
      function f(s: string) {
        s.slice(1) === "bar"
      }
    `;
    yield dedent`
      function f(s: string) {
        pattern.test(s)
      }
    `;
    yield dedent`
      function f(s: string) {
        /^bar/.test()
      }
    `;
    yield dedent`
      function f(x: { test(): void }, s: string) {
        x.test(s)
      }
    `;
    yield dedent`
      function f(s: string) {
        s.slice(0, -4) === "car"
      }
    `;
    yield dedent`
      function f(x: string, s: string) {
        x.endsWith('foo') && x.slice(0, -4) === 'bar'
      }
    `;
    yield dedent`
      function f(s: string) {
        s[0] === "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s[0] !== "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s[0] == "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        s[0] != "a"
      }
    `;
    yield dedent`
      function f(s: string) {
        (s)[0] === ("a")
      }
    `;
    yield dedent`
      function f(s: string) {
        s.slice(0, length) === needle // the 'length' can be different to 'needle.length'
      }
    `;
    yield dedent`
      function f(s: string) {
        s.slice(-length) === needle // 'length' can be different
      }
    `;
    yield dedent`
      function f(s: string) {
        s.slice(0, 3) === needle
      }
    `;
  },
  *invalid() {
    yield {
      code: dedent`
        function f(s: string) {
          s[0] === "あ"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("あ")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s[0] === "👍" // the length is 2.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string, t: string) {
          s[0] === t // the length of t is unknown.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s[s.length - 1] === "a"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("a")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    // String#charAt
    yield {
      code: dedent`
        function f(s: string) {
          s.charAt(0) === "a"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.charAt(0) !== "a"
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.charAt(0) == "a"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.charAt(0) != "a"
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.charAt(0) === "あ"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("あ")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.charAt(0) === "👍" // the length is 2.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string, t: string) {
          s.charAt(0) === t // the length of t is unknown.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.charAt(s.length - 1) === "a"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("a")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          (s).charAt(0) === "a"
        }
      `,
      output: dedent`
        function f(s: string) {
          (s).startsWith("a")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };

    // String#indexOf
    yield {
      code: dedent`
        function f(s: string) {
          s.indexOf(needle) === 0
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.indexOf(needle) !== 0
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.indexOf(needle) == 0
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.indexOf(needle) != 0
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };

    // String#lastIndexOf
    yield {
      code: dedent`
        function f(s: string) {
          s.lastIndexOf("bar") === s.length - 3
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.lastIndexOf("bar") !== s.length - 3
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.lastIndexOf("bar") == s.length - 3
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.lastIndexOf("bar") != s.length - 3
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.lastIndexOf("bar") === s.length - "bar".length
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.lastIndexOf(needle) === s.length - needle.length
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };

    // String#match
    yield {
      code: dedent`
        function f(s: string) {
          s.match(/^bar/) !== null
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.match(/^bar/) != null
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.match(/bar$/) !== null
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.match(/bar$/) != null
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.match(/^bar/) === null
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.match(/^bar/) == null
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.match(/bar$/) === null
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.match(/bar$/) == null
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        const pattern = /^bar/
        function f(s: string) {
          s.match(pattern) != null
        }
      `,
      output: dedent`
        const pattern = /^bar/
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        const pattern = new RegExp("^bar")
        function f(s: string) {
          s.match(pattern) != null
        }
      `,
      output: dedent`
        const pattern = new RegExp("^bar")
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        const pattern = /^"quoted"/
        function f(s: string) {
          s.match(pattern) != null
        }
      `,
      output: dedent`
        const pattern = /^"quoted"/
        function f(s: string) {
          s.startsWith("\\"quoted\\"")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };

    // String#slice
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(0, 3) === "bar"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(0, 3) !== "bar"
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(0, 3) == "bar"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(0, 3) != "bar"
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(0, needle.length) === needle
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(0, needle.length) == needle // hating implicit type conversion
        }
      `,
      output: null,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(-3) === "bar"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(-3) !== "bar"
        }
      `,
      output: dedent`
        function f(s: string) {
          !s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(-needle.length) === needle
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.slice(s.length - needle.length) === needle
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.substring(0, 3) === "bar"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.substring(-3) === "bar" // the code is probably mistake.
        }
      `,
      output: null,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          s.substring(s.length - 3, s.length) === "bar"
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };

    // RegExp#test
    yield {
      code: dedent`
        function f(s: string) {
          /^bar/.test(s)
        }
      `,
      output: dedent`
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          /bar$/.test(s)
        }
      `,
      output: dedent`
        function f(s: string) {
          s.endsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferEndsWith' }]
    };
    yield {
      code: dedent`
        const pattern = /^bar/
        function f(s: string) {
          pattern.test(s)
        }
      `,
      output: dedent`
        const pattern = /^bar/
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        const pattern = new RegExp("^bar")
        function f(s: string) {
          pattern.test(s)
        }
      `,
      output: dedent`
        const pattern = new RegExp("^bar")
        function f(s: string) {
          s.startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        const pattern = /^"quoted"/
        function f(s: string) {
          pattern.test(s)
        }
      `,
      output: dedent`
        const pattern = /^"quoted"/
        function f(s: string) {
          s.startsWith("\\"quoted\\"")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f(s: string) {
          /^bar/.test(a + b)
        }
      `,
      output: dedent`
        function f(s: string) {
          (a + b).startsWith("bar")
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };

    // Test for variation of string types.
    yield {
      code: dedent`
        function f(s: "a" | "b") {
          s.indexOf(needle) === 0
        }
      `,
      output: dedent`
        function f(s: "a" | "b") {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        function f<T extends "a" | "b">(s: T) {
          s.indexOf(needle) === 0
        }
      `,
      output: dedent`
        function f<T extends "a" | "b">(s: T) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
    yield {
      code: dedent`
        type SafeString = string & {__HTML_ESCAPED__: void}
        function f(s: SafeString) {
          s.indexOf(needle) === 0
        }
      `,
      output: dedent`
        type SafeString = string & {__HTML_ESCAPED__: void}
        function f(s: SafeString) {
          s.startsWith(needle)
        }
      `,
      errors: [{ messageId: 'preferStartsWith' }]
    };
  }
});
