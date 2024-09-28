/*
 * eslint-plugin-sonarjs
 * Copyright (C) 2018-2021 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import mod from '.';
import { dedent } from 'ts-dedent';
import { runTest } from '../../../../../lib/eslint-plugin-tester';

runTest({
  module: mod,
  valid: [
    dedent`
      function foo() {
        if (something) {
          return true;
        } else if (something) {
          return false;
        } else {
          return true;
        }
      }
    `,
    dedent`
      function foo() {
        if (something) {
          return x;
        } else {
          return false;
        }
      }
    `,
    dedent`
      function foo(y) {
        if (something) {
          return true;
        } else {
          return foo;
        }
      }
    `,
    dedent`
      function foo() {
        if (something) {
          doSomething();
        } else {
          return true;
        }
      }
    `,
    dedent`
      function foo() {
        if (something) {
          doSomething();
          return true;
        } else {
          return false;
        }
      }
    `,
    dedent`
      function foo() {
        if (something) {
          return;
        } else {
          return true;
        }
      }
    `,
    dedent`
      function foo() {
        if (something) {
          return true;
        }
      }
    `,
    dedent`
      function foo() {
        if (something) {
          return foo(true);
        } else {
          return foo(false);
        }
      }
    `,
    dedent`
      function foo() {
        if (something) {
          var x;
        } else {
          return false;
        }
      }
    `,
    dedent`
      function foo() {
        if (something) {
          function f() {}
          return false;
        } else {
          return true;
        }
      }
    `
  ],
  invalid: [
    {
      code: dedent`
        function foo() {
          if (something) {
            return true;
          } else {
            return false;
          }

          if (something) {
            return false;
          } else {
            return true;
          }

          if (something) return true;
          else return false;

          if (something) {
            return true;
          } else {
            return true;
          }
        }
      `,
      errors: [
        {
          messageId: 'replaceIfThenElseByReturn',
          line: 2,
          column: 3,
          endLine: 6,
          endColumn: 4,
          suggestions: [
            {
              messageId: 'suggestCast',
              output: dedent`
                function foo() {
                  return !!(something);

                  if (something) {
                    return false;
                  } else {
                    return true;
                  }

                  if (something) return true;
                  else return false;

                  if (something) {
                    return true;
                  } else {
                    return true;
                  }
                }
              `
            },
            {
              messageId: 'suggestBoolean',
              output: dedent`
                function foo() {
                  return something;

                  if (something) {
                    return false;
                  } else {
                    return true;
                  }

                  if (something) return true;
                  else return false;

                  if (something) {
                    return true;
                  } else {
                    return true;
                  }
                }
              `
            }
          ]
        },
        {
          messageId: 'replaceIfThenElseByReturn',
          line: 8,
          column: 3,
          endLine: 12,
          endColumn: 4,
          suggestions: [{
            messageId: 'suggest',
            output: dedent`
              function foo() {
                if (something) {
                  return true;
                } else {
                  return false;
                }

                return !(something);

                if (something) return true;
                else return false;

                if (something) {
                  return true;
                } else {
                  return true;
                }
              }
            `
          }]
        },
        {
          messageId: 'replaceIfThenElseByReturn',
          line: 14,
          column: 3,
          endLine: 15,
          endColumn: 21,
          suggestions: [
            {
              messageId: 'suggestCast',
              output: dedent`
                function foo() {
                  if (something) {
                    return true;
                  } else {
                    return false;
                  }

                  if (something) {
                    return false;
                  } else {
                    return true;
                  }

                  return !!(something);

                  if (something) {
                    return true;
                  } else {
                    return true;
                  }
                }
              `
            },
            {
              messageId: 'suggestBoolean',
              output: dedent`
                function foo() {
                  if (something) {
                    return true;
                  } else {
                    return false;
                  }

                  if (something) {
                    return false;
                  } else {
                    return true;
                  }

                  return something;

                  if (something) {
                    return true;
                  } else {
                    return true;
                  }
                }
              `
            }
          ]
        },
        {
          messageId: 'replaceIfThenElseByReturn',
          line: 17,
          column: 3,
          endLine: 21,
          endColumn: 4,
          suggestions: [
            {
              messageId: 'suggestCast',
              output: dedent`
                function foo() {
                  if (something) {
                    return true;
                  } else {
                    return false;
                  }

                  if (something) {
                    return false;
                  } else {
                    return true;
                  }

                  if (something) return true;
                  else return false;

                  return !!(something);
                }
              `
            },
            {
              messageId: 'suggestBoolean',
              output: dedent`
                function foo() {
                  if (something) {
                    return true;
                  } else {
                    return false;
                  }

                  if (something) {
                    return false;
                  } else {
                    return true;
                  }

                  if (something) return true;
                  else return false;

                  return something;
                }
              `
            }
          ]
        }
      ]
    },
    {
      code: dedent`
        function fn() {
          if (foo) {
            if (something) {
              return true
            }
            return false
          }

          if (bar) {
            if (something) {
              return false
            }
            return true
          }

          if (baz) {
            if (something) {
              return false
            }
          }
        }
      `,
      errors: [
        {
          messageId: 'replaceIfThenElseByReturn',
          line: 3,
          column: 5,
          endLine: 5,
          endColumn: 6,
          suggestions: [
            {
              messageId: 'suggestCast',
              output: dedent`
                function fn() {
                  if (foo) {
                    return !!(something);
                  }

                  if (bar) {
                    if (something) {
                      return false
                    }
                    return true
                  }

                  if (baz) {
                    if (something) {
                      return false
                    }
                  }
                }
              `
            },
            {
              messageId: 'suggestBoolean',
              output: dedent`
                function fn() {
                  if (foo) {
                    return something;
                  }

                  if (bar) {
                    if (something) {
                      return false
                    }
                    return true
                  }

                  if (baz) {
                    if (something) {
                      return false
                    }
                  }
                }
              `
            }
          ]
        },
        {
          messageId: 'replaceIfThenElseByReturn',
          line: 10,
          column: 5,
          endLine: 12,
          endColumn: 6,
          suggestions: [{
            messageId: 'suggest',
            output: dedent`
              function fn() {
                if (foo) {
                  if (something) {
                    return true
                  }
                  return false
                }

                if (bar) {
                  return !(something);
                }

                if (baz) {
                  if (something) {
                    return false
                  }
                }
              }
            `
          }]
        }
      ]
    },
    {
      code: dedent`
        function foo() {
          if (bar()) {
            if (baz()) {
              return true;
            } else {
              return false;
            }
          }
          return qux();
        }
      `,
      errors: [
        {
          messageId: 'replaceIfThenElseByReturn',
          suggestions: [
            {
              messageId: 'suggestCast',
              output: dedent`
                function foo() {
                  if (bar()) {
                    return !!(baz());
                  }
                  return qux();
                }
              `
            },
            {
              messageId: 'suggestBoolean',
              output: dedent`
                function foo() {
                  if (bar()) {
                    return baz();
                  }
                  return qux();
                }
              `
            }
          ]
        }
      ]
    },
    {
      code: dedent`
        function foo() {
          if (bar()) {
            if (baz()) {
              return true;
            }
            return false;
          }
          return qux();
        }
      `,
      errors: [
        {
          messageId: 'replaceIfThenElseByReturn',
          suggestions: [
            {
              messageId: 'suggestCast',
              output: dedent`
                function foo() {
                  if (bar()) {
                    return !!(baz());
                  }
                  return qux();
                }
              `
            },
            {
              messageId: 'suggestBoolean',
              output: dedent`
                function foo() {
                  if (bar()) {
                    return baz();
                  }
                  return qux();
                }
              `
            }
          ]
        }
      ]
    },
    {
      code: dedent`
        function foo() {
          if (!bar()) {
            return true;
          } else {
            return false;
          }
        }
      `,
      errors: [
        {
          messageId: 'replaceIfThenElseByReturn',
          suggestions: [
            {
              messageId: 'suggest',
              output: dedent`
                function foo() {
                  return !bar();
                }
              `
            }
          ]
        }
      ]
    },
    {
      code: dedent`
        function foo() {
          if (bar() > 0) {
            return true;
          } else {
            return false;
          }
        }
      `,
      errors: [
        {
          messageId: 'replaceIfThenElseByReturn',
          suggestions: [
            {
              messageId: 'suggest',
              output: dedent`
                function foo() {
                  return bar() > 0;
                }
              `
            }
          ]
        }
      ]
    },
    {
      code: dedent`
        function foo() {
          if (baz() > 0) {
            return false;
          } else {
            return true;
          }
        }
      `,
      errors: [
        {
          messageId: 'replaceIfThenElseByReturn',
          suggestions: [
            {
              messageId: 'suggest',
              output: dedent`
                function foo() {
                  return !(baz() > 0);
                }
              `
            }
          ]
        }
      ]
    },
    {
      code: dedent`
        function foo() {
          if (baz()) {
            return false;
          } else {
            return true;
          }
        }
      `,
      errors: [
        {
          messageId: 'replaceIfThenElseByReturn',
          suggestions: [
            {
              messageId: 'suggest',
              output: dedent`
                function foo() {
                  return !(baz());
                }
              `
            }
          ]
        }
      ]
    }
  ]
});
