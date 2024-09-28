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
import { describe } from 'vitest';
import mod from '.';
import { runTest } from '../../../../../lib/eslint-plugin-tester';

runTest({
  module: mod,
  valid: [
    'Foo.prototype.property = 1;',
    'Foo.prototype = function () {};',
    'Foo.proto.property = function () {};'

  ],
  invalid: [
    {
      code: 'Foo.prototype.property = function () {};',
      errors: [
        {
          messageId: 'declareClass',
          data: {
            class: 'Foo',
            declaration: 'property'
          },
          line: 1,
          endLine: 1,
          column: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `
          const Bar = () => {};
          Foo.prototype.property = () => {};`,
      errors: 1
    }
  ]
});

describe('Class methods should be used instead of "prototype" assignments [ts]', () => {
  runTest({
    module: mod,
    valid: [
      {
        code: 'Foo.prototype.property = 1;'
      },
      {
        code: 'Foo.prototype.property = Bar;'
      }
    ],
    invalid: [
      {
        code: 'Foo.prototype.property = function () {};',
        errors: [
          {
            messageId: 'declareClass',
            data: {
              class: 'Foo',
              declaration: 'property'
            },
            line: 1,
            endLine: 1,
            column: 1,
            endColumn: 23
          }
        ]
      },
      {
        code: `
          function Bar() {}
          Foo.prototype.property = Bar;`,
        errors: 1
      },
      {
        code: `
          const Bar = () => {};
          Foo.prototype.property = Bar;`,
        errors: 1
      }
    ]
  });
});
