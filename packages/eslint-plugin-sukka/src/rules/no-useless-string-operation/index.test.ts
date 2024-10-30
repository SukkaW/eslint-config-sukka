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
import { runTest } from '@eslint-sukka/internal';

runTest({
  module: mod,
  valid: [
    {
      code: 'let res = \'hello\'.toUpperCase();'
    },
    {
      code: 'let res = \'hello\'.substr(1, 2).toUpperCase();'
    },
    {
      code: `
        let str = 'hello';
        let res = str.toUpperCase();
      `
    },
    {
      code: '\'hello\'[\'whatever\']();'
    }
  ],
  invalid: [
    {
      code: '\'hello\'.toUpperCase();',
      errors: [
        {
          messageId: 'uselessStringOp',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `
        let str = 'hello';
        str.toUpperCase();`,
      errors: [
        {
          messageId: 'uselessStringOp',
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 24
        }
      ]
    },
    {
      code: `
        let str = 'hello';
        str.toLowerCase().toUpperCase().toLowerCase();`,
      errors: [
        {
          messageId: 'uselessStringOp',
          line: 3,
          column: 41,
          endLine: 3,
          endColumn: 52
        }
      ]
    },
    {
      code: '\'hello\'.substr(1, 2).toUpperCase();',
      errors: 1
    }
  ]
});
