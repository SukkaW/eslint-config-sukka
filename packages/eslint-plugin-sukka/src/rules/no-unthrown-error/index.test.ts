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
import rule from '.';
import { runTest } from '@eslint-sukka/internal';

runTest({
  module: rule,
  valid: [
    'foo(new Error());',
    'foo(TypeError);',
    'throw new Error();',
    'new LooksLikeAnError().doSomething();',
    'const error = new Error();',
    'const error = new Error(); error.something = 10; throw error;'
  ],
  invalid: [
    {
      code: 'new Error();',
      errors: [
        {
          messageId: 'throwOrRemoveError',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 12,
          suggestions: [
            {
              messageId: 'suggestThrowError',
              output: 'throw new Error();'
            }
          ]
        }
      ]
    },
    {
      code: 'new TypeError();',
      errors: [{ messageId: 'suggestThrowError' }]
    },
    {
      code: 'new MyError();',
      errors: [{ messageId: 'suggestThrowError' }]
    },
    {
      code: 'new A.MyError();',
      errors: [{ messageId: 'suggestThrowError' }]
    },
    {
      code: dedent`
        new A(function () {
          new SomeError();
        });
      `,
      errors: [{ messageId: 'suggestThrowError' }]
    },
    {
      code: '(new MyException());',
      errors: [{ messageId: 'throwOrRemoveError', suggestions: [{ messageId: 'suggestThrowError', output: 'throw (new MyException());' }] }]
    }
  ]
});
