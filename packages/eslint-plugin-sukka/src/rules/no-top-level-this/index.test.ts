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
import { runTest } from '@eslint-sukka/internal';
import mod from '.';

runTest({
  module: mod,
  valid: [
    'console.log(this);',
    {
      code: `
      function foo() {
        x = this.a    // OK
        var func = s => this.foo(s)   // OK
        var func1 = s => {return this.foo(s)} // OK
      }`
    },
    {
      code: `
      var foo = function(){
        foo(this)
      }`
    },
    {
      code: 'var func = s => this.foo(s)'
    },
    {
      code: `
      class C {
        constructor() {
          this.a = [];   // ok
        }
      
        method1(){
          this.a = [];  // ok
        }
      
        get getMethod() {
          return this.bones.length;  // ok
        }
      
        set setMethod(foo) {
          this.id = foo;  // ok
        }
      }`
    },
    {
      code: `
      class C {
        prop = this.C
      }`
    },
    {
      code: `
      const c = class C {
        prop = this.C
      }`
    }
  ],
  invalid: [
    {
      code: 'console.log(this.prop);',
      errors: [
        {
          messageId: 'removeThis',
          line: 1,
          endLine: 1,
          column: 13,
          endColumn: 17,
          suggestions: [
            {
              messageId: 'suggestRemoveThis',
              output: 'console.log(prop);'
            },
            {
              messageId: 'suggestUseGlobalThis',
              output: 'console.log(globalThis.prop);'
            }
          ]
        }
      ]
    },
    {
      code: 'this.a = function(){}',
      errors: 1
    },
    {
      code: 'var x = this.a()',
      errors: 1
    },
    {
      code: `
      if (!this.JSON) {
        this.JSON = {}  
      }`,
      errors: 2
    },
    {
      code: 'this.foo = bar;',
      errors: [
        {
          messageId: 'removeThis',
          suggestions: [
            {
              messageId: 'suggestRemoveThis',
              output: 'foo = bar;'
            },
            {
              messageId: 'suggestUseGlobalThis',
              output: 'globalThis.foo = bar;'
            }
          ]
        }
      ]
    },
    {
      code: 'this.foo.bar.baz = qux;',
      errors: [
        {
          messageId: 'removeThis',
          suggestions: [
            {
              messageId: 'suggestRemoveThis',
              output: 'foo.bar.baz = qux;'
            },
            {
              messageId: 'suggestUseGlobalThis',
              output: 'globalThis.foo.bar.baz = qux;'
            }
          ]
        }
      ]
    },
    {
      code: 'this[\'f\' + \'o\' + \'o\'] = bar;',
      errors: [
        {
          messageId: 'removeThis',
          suggestions: []
        }
      ]
    }
  ]
});
