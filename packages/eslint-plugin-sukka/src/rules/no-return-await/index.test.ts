import { runTest } from '@eslint-sukka/internal';
import type { TestCaseError } from '@typescript-eslint/rule-tester';

import module from './index';
import { dedent } from 'ts-dedent';
import { AST_NODE_TYPES } from '@typescript-eslint/types';

function createErrorList({ suggestionOutput: output }: { suggestionOutput?: string } = {}): Array<TestCaseError<'removeAwait' | 'redundantUseOfAwait'>> {
  // pending https://github.com/eslint/espree/issues/304, the type should be "Keyword"
  return [{
    messageId: 'redundantUseOfAwait',
    type: AST_NODE_TYPES.Identifier,
    suggestions: output
      ? [{
        messageId: 'removeAwait', output
      }]
      : []
  } as const];
}

runTest({
  module,
  *valid() {
    yield '\nasync function foo() {\n\tawait bar(); return;\n}\n';
    yield '\nasync function foo() {\n\tconst x = await bar(); return x;\n}\n';
    yield '\nasync () => { return bar(); }\n';
    yield '\nasync () => bar()\n';
    yield '\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n';
    yield '\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n';
    yield '\nasync function foo() {\n\treturn (await bar() && a);\n}\n';
    yield '\nasync function foo() {\n\treturn (await bar() || a);\n}\n';
    yield '\nasync function foo() {\n\treturn (a && await baz() && b);\n}\n';
    yield '\nasync function foo() {\n\treturn (await bar(), a);\n}\n';
    yield '\nasync function foo() {\n\treturn (await baz(), await bar(), a);\n}\n';
    yield '\nasync function foo() {\n\treturn (a, b, (await bar(), c));\n}\n';
    yield '\nasync function foo() {\n\treturn (await bar() ? a : b);\n}\n';
    yield '\nasync function foo() {\n\treturn ((a && await bar()) ? b : c);\n}\n';
    yield '\nasync function foo() {\n\treturn (baz() ? (await bar(), a) : b);\n}\n';
    yield '\nasync function foo() {\n\treturn (baz() ? (await bar() && a) : b);\n}\n';
    yield '\nasync function foo() {\n\treturn (baz() ? a : (await bar(), b));\n}\n';
    yield '\nasync function foo() {\n\treturn (baz() ? a : (await bar() && b));\n}\n';
    yield '\nasync () => (await bar(), a)\n';
    yield '\nasync () => (await bar() && a)\n';
    yield '\nasync () => (await bar() || a)\n';
    yield '\nasync () => (a && await bar() && b)\n';
    yield '\nasync () => (await baz(), await bar(), a)\n';
    yield '\nasync () => (a, b, (await bar(), c))\n';
    yield '\nasync () => (await bar() ? a : b)\n';
    yield '\nasync () => ((a && await bar()) ? b : c)\n';
    yield '\nasync () => (baz() ? (await bar(), a) : b)\n';
    yield '\nasync () => (baz() ? (await bar() && a) : b)\n';
    yield '\nasync () => (baz() ? a : (await bar(), b))\n';
    yield '\nasync () => (baz() ? a : (await bar() && b))\n';
    yield dedent`
      async function foo() {
        try {
          return await bar();
        } catch (e) {
          baz();
        }
      }
    `;
    yield dedent`
      async function foo() {
        try {
          return await bar();
        } finally {
          baz();
        }
      }
    `;
    yield dedent`
      async function foo() {
        try {}
        catch (e) {
          return await bar();
        } finally {
          baz();
        }
      }
    `;
    yield dedent`
      async function foo() {
        try {
          try {}
          finally {
            return await bar();
          }
        } finally {
          baz();
        }
      }
    `;
    yield dedent`
      async function foo() {
        try {
          try {}
          catch (e) {
            return await bar();
          }
        } finally {
          baz();
        }
      }
    `;
    yield dedent`
      async function foo() {
        try {
          return (a, await bar());
        } catch (e) {
          baz();
        }
      }
    `;
    yield dedent`
      async function foo() {
        try {
          return (qux() ? await bar() : b);
        } catch (e) {
          baz();
        }
      }
    `;
    yield dedent`
      async function foo() {
        try {
          return (a && await bar());
        } catch (e) {
          baz();
        }
      }
    `;
  },
  *invalid() {
    yield {
      code: '\nasync function foo() {\n\treturn await bar();\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn bar();\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn await(bar());\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (bar());\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (a, await bar());\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (a, bar());\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (a, b, await bar());\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (a, b, bar());\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (a && await bar());\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (a && bar());\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (a && b && await bar());\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (a && b && bar());\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (a || await bar());\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (a || bar());\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (a, b, (c, d, await bar()));\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (a, b, (c, d, bar()));\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (a, b, (c && await bar()));\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (a, b, (c && bar()));\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (await baz(), b, await bar());\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (await baz(), b, bar());\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (baz() ? await bar() : b);\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (baz() ? bar() : b);\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (baz() ? a : await bar());\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (baz() ? a : bar());\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (baz() ? (a, await bar()) : b);\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (baz() ? (a, bar()) : b);\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (baz() ? a : (b, await bar()));\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (baz() ? a : (b, bar()));\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (baz() ? (a && await bar()) : b);\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (baz() ? (a && bar()) : b);\n}\n' })
    };
    yield {
      code: '\nasync function foo() {\n\treturn (baz() ? a : (b && await bar()));\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\n\treturn (baz() ? a : (b && bar()));\n}\n' })
    };
    yield {
      code: '\nasync () => { return await bar(); }\n',
      errors: createErrorList({ suggestionOutput: '\nasync () => { return bar(); }\n' })
    };
    yield {
      code: '\nasync () => await bar()\n',
      errors: createErrorList({ suggestionOutput: '\nasync () => bar()\n' })
    };
    yield {
      code: '\nasync () => (a, b, await bar())\n',
      errors: createErrorList({ suggestionOutput: '\nasync () => (a, b, bar())\n' })
    };
    yield {
      code: '\nasync () => (a && await bar())\n',
      errors: createErrorList({ suggestionOutput: '\nasync () => (a && bar())\n' })
    };
    yield {
      code: '\nasync () => (baz() ? await bar() : b)\n',
      errors: createErrorList({ suggestionOutput: '\nasync () => (baz() ? bar() : b)\n' })
    };
    yield {
      code: '\nasync () => (baz() ? a : (b, await bar()))\n',
      errors: createErrorList({ suggestionOutput: '\nasync () => (baz() ? a : (b, bar()))\n' })
    };
    yield {
      code: '\nasync () => (baz() ? a : (b && await bar()))\n',
      errors: createErrorList({ suggestionOutput: '\nasync () => (baz() ? a : (b && bar()))\n' })
    };
    yield {
      code: '\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n' })
    };
    yield {
      code: '\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n',
      errors: createErrorList({ suggestionOutput: '\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n' })
    };
    yield {
      code: dedent`
        async function foo() {
          try {}
          finally {
            return await bar();
          }
        }
      `,
      errors: createErrorList({
        suggestionOutput: dedent`
          async function foo() {
            try {}
            finally {
              return bar();
            }
          }
        `
      })
    };
    yield {
      code: dedent`
        async function foo() {
          try {}
          catch (e) {
            return await bar();
          }
        }
      `,
      errors: createErrorList({
        suggestionOutput: dedent`
          async function foo() {
            try {}
            catch (e) {
              return bar();
            }
          }
        `
      })
    };
    yield {
      code: dedent`
        try {
          async function foo() {
            return await bar();
          }
        } catch (e) {}
      `,
      errors: createErrorList({
        suggestionOutput: dedent`
          try {
            async function foo() {
              return bar();
            }
          } catch (e) {}
        `
      })
    };
    yield {
      code: dedent`
        try {
          async () => await bar();
        } catch (e) {}
      `,
      errors: createErrorList({
        suggestionOutput: dedent`
          try {
            async () => bar();
          } catch (e) {}
        `
      })
    };
    yield {
      code: dedent`
        async function foo() {
          try {}
          catch (e) {
            try {}
            catch (e) {
              return await bar();
            }
          }
        }
      `,
      errors: createErrorList({
        suggestionOutput: dedent`
          async function foo() {
            try {}
            catch (e) {
              try {}
              catch (e) {
                return bar();
              }
            }
          }
        `
      })
    };
    yield {
      code: dedent`
        async function foo() {
          return await new Promise(resolve => {
            resolve(5);
          });
        }
      `,
      errors: createErrorList({
        suggestionOutput: dedent`
          async function foo() {
            return new Promise(resolve => {
              resolve(5);
            });
          }
        `
      })
    };
    yield {
      code: dedent`
        async () => {
          return await (
            foo()
          )
        };
      `,
      errors: createErrorList({
        suggestionOutput: dedent`
          async () => {
            return (
              foo()
            )
          };
        `
      })
    };
    yield {
      code: dedent`
        async function foo() {
          return await // Test
            5;
        }
      `,
      errors: createErrorList()
    };
  }
});
