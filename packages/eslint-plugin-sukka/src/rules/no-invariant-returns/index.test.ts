/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
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
import { dedent } from 'ts-dedent';
import mod from '.';
import { runTest } from '@eslint-sukka/internal';
import { createFixedArray } from 'foxts/create-fixed-array';

runTest({
  module: mod,
  valid: [
    {
      code: `
        function identifiers1(a: number) {
          const c = "foo";
          if (a == 1) {
              return c;
          }
          c += "aa";
          return c;
        }
        
        function identifiers2(a: number) {
          const c = "foo";
          if (a == 1) {
              return c;
          }
          if (a > 5) {
              c += "aa";
          }
          return c;
        }
        
        function identifiers3(a: number) {
          let c;
          if (a == 1) {
              return c;
          }
          c = 1;
          return c;
        }
        
        function identifiers4(a: number) {
          const c = {};
          if (a == 1) {
              return c;
          }
          c.prop1 = "newValue";
          return c;
        }
        
        function identifiers5(a: number) {
          const c = {};
          if (a == 1) {
              return c;
          }
          c.prop1.prop2 = "newValue";
          return c;
        }
        
        function identifiers6(a: number) {
          const c = {};
          if (a == 1) {
              return c;
          }
          c[1] = "newValue";
          return c;
        }
        
        function identifiers7(a: number) {
          const c = {};
          if (a == 1) {
              return c;
          }
          c['abcde'] = "newValue";
          return c;
        }
        
        function identifiers8(a: number) {
          const c = {};
          if (a == 1) {
              return c;
          }
          c['abcde'].prop1[2].prop2 = "newValue";
          return c;
        }
        
        function identifiers9(a: number) {
          const c = {};
          if (a == 1) {
              return c;
          }
          c.doSomething(); // Ok - we don't know whether state of c was updated or not 
          return c;
        }
        
        function identifiers10(a: number) {
          const c = {};
          if (a == 1) {
            return c;
          }
          doSomething(c); // Ok - we don't know whether state of c was updated or not
          return c;
        }`
    },
    {
      code: `
        function oneReturnValue() {
            return 1;
        }
        
        function withImplicitReturn(p: boolean) {
            if (p) {
                return 2;
            } else if (!p) {
                return 2;
            }
        }
        
        function differentValues(p: boolean) {
            if (p) {
                return 10;
            } else {
                return 11;
            }
        }
        
        function withUnaryExpression(p: boolean) {
            if (p) {
                return !1;
            } else {
                return 1;
            }
        }
        
        function allImplicitReturns(p: boolean) {
            if (p) {
                foo();
            } else {
                return;
            }
        
            function foo() { }
        }
        
        function explicitUndefinedDeclaration(p: boolean): number | undefined {
            if (p) {
                return 1;
            }
        }
        
        function empty() {
        
        }
        
        function explicitUndefinedDeclaration1(p: boolean): undefined {
            if (p) {
                return void 0;
            }
        }
        
        function explicitVoidDeclaration1(p: boolean): void | number {
            if (p) {
                return 0;
            }
        }
        
        function explicitVoidDeclaration(p: boolean): void {
            if (p) {
                return void 0;
            }
        
        }
        
        function withThrowAndExplicitReturn(cond: boolean, cond2: boolean) {
            if (cond) {
                throw 42;
            }
            if (cond2) {
                return 42;
            }
            return 42;
        }
        
        function withThrowAndImplicitReturn(cond: boolean) {
            if (cond) {
                throw "";
            }
            console.log("bar");
        }
        
        var arrowWithExpressionBody = p => p ? 1 : 1;
        
        function sameSymbolicValueSameConstraint(p) { // FN - not using SE
          var num = foo() - bar();
          var num2 = num;
          if (p) {
            return num;
          } else {
            return num2;
          }
        }`
    }
  ],
  invalid: [
    {
      code: dedent`
        function numbers(a: number) {
          if (a == 1) {
              return 42;
          }
          return 42;
        }
      `,
      errors: [
        {
          messageId: 'refactorReturn',
          line: 1,
          endLine: 6,
          column: 1,
          endColumn: 2
        }
      ]
    },
    {
      code: `
        function strings(a: number) {
            if (a == 1) {
              return "foo";
            } else if (a > 10) {
              return "foo";
            }
            return "foo";
        }`,
      errors: [
        {
          messageId: 'refactorReturn',
          line: 2,
          endLine: 9
        }
      ]

    },
    {
      code: 'var arrowNok = (p) => { if (p) { return "foo"; } return "foo"; };',
      errors: [
        {
          messageId: 'refactorReturn',
          line: 1,
          endLine: 1
        }
      ]
    },
    {
      code: dedent`
        function identifiers(a: number) {
          const c = "foo";
          if (a == 1) {
              return c;
          }
          return c;
        }
      `,
      errors: [
        {
          messageId: 'refactorReturn',
          line: 1,
          endLine: 7
        }
      ]

    },
    {
      code: `
        function identifiers(count) {
          count -= 1;
          if (count <= 0) {
            return count;
          }
        
          const var2 = doSomethingElse();
          return count;
        }`,
      errors: [
        {
          messageId: 'refactorReturn',
          line: 2,
          endLine: 10
        }
      ]

    },
    {
      code: `
        function numbers(a: number) {
          if (a == 1) {
              return 42;
          }
          var arrowNull = (p) => { if (p) { return null; } return ""; };
          return 42;
        }`,
      errors: [
        {
          messageId: 'refactorReturn',
          line: 2,
          endLine: 8
        }
      ]

    },
    {
      code: `
        function numbers(a: number) {
          if (a == 1) {
              return 42;
          }
          var arrowNull = (p) => { if (p) { return ""; } return ""; };
          return "";
        }`,
      errors: [
        {
          messageId: 'refactorReturn',
          line: 6,
          endLine: 6
        }
      ]

    },
    {
      code: `
        function identifiers(a: number) {
          let c;
          c = 1;
          if (a == 1) {
              return c;
          }
          return c;
        }`,
      errors: [
        {
          messageId: 'refactorReturn'
        }
      ]

    },
    {
      code: `
        function withThrowAndExplicitReturn(cond: boolean, cond2: boolean) {
          try {
              throw 42;
          } catch(e) {}
          
          if (cond2) {
              return 42;
          }
          return 42;
        }`,
      errors: [
        {
          messageId: 'refactorReturn'
        }
      ]
    },
    {
      code: `
        registerFunction(
          function() {
            const c = "foo";
            if (a == 1) {
                return c;
            }
            return c;
          });`,
      errors: [
        {
          messageId: 'refactorReturn',
          line: 3,
          endLine: 9
        }
      ]
    },
    {
      code: `
        var arrowNull = (p) => { if (p) { return null; } return null; };
        var arrowBoolean = (p) => { if (p) { return true; } return true; };
        var arrowEquivalent1 = (p) => { if (p) { return !true; } return false; };
        var arrowEquivalent2 = (p) => { if (p) { return 2; } return +2; };
        var arrowEquivalent3 = (p) => { if (p) { return 2; } return +(+2); };
        var arrowEquivalent4 = (p) => { if (p) { return !1; } return false; };
        var arrowEquivalent5 = (p) => { if (p) { return "boolean"; } return typeof false; };
        var arrowEquivalent6 = (p) => { if (p) { return ~4; } return -5; };
      `,
      errors: createFixedArray(8).map(() => ({ messageId: 'refactorReturn' }))
    }
  ]
});
