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
import mod from '.';
import { runTest } from '../../../../../lib/eslint-plugin-tester';

runTest({
  module: mod,
  valid: [
    {
      code: 'i = j++;'
    },
    {
      code: 'i = ++i;'
    },
    {
      code: 'i++;'
    },
    {
      code: `function f1() {
              let i = 1;
              i++;
            }`
    },
    {
      code: `let outside = 1;
             function f1() {
               return outside++;
             }`
    },
    {
      code: `function f1() {
              let i = 1;
              return ++i;
            }`
    }
  ],
  invalid: [
    {
      code: 'i = i++;',
      errors: [
        {
          messageId: 'removeIncrement',
          line: 1,
          endLine: 1,
          column: 5,
          endColumn: 8
        }
      ]
    },
    {
      code: 'i = i--; ',
      errors: [
        {
          messageId: 'removeIncrement'
        }
      ]
    },
    {
      code: `function f1() {
              let i = 1;
              return i++;
            }`,
      errors: [
        {
          messageId: 'removeIncrement'
        }
      ]
    }
  ]
});
