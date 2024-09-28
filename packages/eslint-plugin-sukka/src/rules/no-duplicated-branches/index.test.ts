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
import { runTest } from '../../../../../lib/eslint-plugin-tester';
import { describe } from 'vitest';

runTest({
  module: mod,
  valid: [
    {
      code: `
      if (a) {
        first('const');
        first('foo');
      } else {
        first('var');
        first('foo');
      }`
    },
    {
      // small branches
      code: `
      if (a) {
        first();
      } else {
        first();
      }`
    },
    {
      code: `
      if (a) {
        first();
        first();
      } else {
        second();
        second();
      }`
    },
    {
      code: `
      if (a) {
        first();
        second();
      } else {
        second();
        first();
      }`
    },
    {
      code: `
      if (a) {
        first();
        second();
      } else {
        first();
        third();
      }`
    },
    {
      code: `
      if (a) {
        first();
        second();
      } else {
        first();
      }`
    },
    {
      code: `
      if(a == 1) {
        doSomething();  //no issue, usually this is done on purpose to increase the readability
      } else if (a == 2) {
        doSomethingElse();
      } else {
        doSomething();
      }`
    }
  ],
  invalid: [
    {
      code: `
      if (a) {
        first();
        second();
      } else {
        first();
        second();
      }`,
      errors: [
        {
          messageId: 'sameConditionalBlock',
          data: {
            type: 'branch',
            line: 2
          },
          line: 5,
          endLine: 8,
          column: 14,
          endColumn: 8
        }
      ]
    },
    {
      code: `
      if (a) {
        first();
        second();
      } else if (b) {
        second();
        third();
      } else {
        first();
        second();
      }`,
      errors: [
        {
          messageId: 'sameConditionalBlock',
          data: {
            type: 'branch',
            line: 2
          },
          line: 8
        }
      ]
    },
    {
      code: `
      if(a == 1) {
        doSomething();
      } else if (a == 2) {
        doSomething();
      }`,
      errors: [
        {
          messageId: 'sameConditionalBlock',
          data: {
            type: 'branch',
            line: 2
          },
          line: 4
        }
      ]
    },
    {
      code: `
      if(a == 1) {
        doSomething();
      } else if (a == 2) {
        doSomething();
      } else if (a == 3) {
        doSomething();
      }`,
      errors: [
        {
          messageId: 'sameConditionalBlock',
          data: {
            type: 'branch',
            line: 2
          },
          line: 4
        },
        {
          messageId: 'sameConditionalBlock',
          data: {
            type: 'branch',
            line: 4
          },
          line: 6
        }
      ]
    }
  ]
});

describe('switch', () => {
  runTest({
    module: mod,
    valid: [
      {
        code: `
        function foo() {
          switch (a) {
            case 1:
              return first();
            default:
              return first();
          }
        }`
      },
      {
        // small branches
        code: `
        switch (a) {
          case 1: {
            // comment
            break;
          }
          case 2: {
            // comment
            break;
          }
        }`
      },
      {
        code: `
        switch (a) {
          case 1:
            first();
            second();
            break;
          default:
            second();
            first();
        }`
      },
      {
        code: `
        switch (a) {
          case 1:
            first();
            second();
            break;
          case 2:
            third();
        }`
      }
    ],
    invalid: [
      {
        code: `
        switch(a) {
          case 2:
          case 1:
            first();
            second();
            break;
          case 3:
            first();
            second();
            break;
        }`,
        errors: [
          {
            messageId: 'sameConditionalBlock',
            data: {
              type: 'case',
              line: '4'
            },
            line: 8
          }
        ]
      },
      {
        code: `
        switch (a) {
          case 1:
            first();
            second();
            break;
          default:
            first();
            second();
        }`,
        errors: [
          {
            messageId: 'sameConditionalBlock',
            data: {
              type: 'case',
              line: 3
            },
            line: 7,
            endLine: 9,
            column: 11,
            endColumn: 22
          }
        ]
      },
      {
        code: `
        switch (a) {
          case 1:
            first();
            first();
            break;
          case 2:
            second();
            second();
            break;
          case 3:
            first();
            first();
            break;
        }`,
        errors: [
          {
            messageId: 'sameConditionalBlock',
            line: 11,
            data: {
              type: 'case',
              line: 3
            }
          }
        ]
      },
      {
        code: `
        switch (a) {
          case 1: {
            first();
            second();
            break;
          }
          default: {
            first();
            second();
          }
        }`,
        errors: [
          {
            messageId: 'sameConditionalBlock',
            line: 8,
            data: {
              type: 'case',
              line: 3
            }
          }
        ]
      },
      {
        // check that for each branch we generate only one issue
        code: `
        switch (a) {
          case 1:
            first();
            second();
            break;
          case 2:
            first();
            second();
            break;
          case 3:
            first();
            second();
            break;
          case 4:
            first();
            second();
            break;
        }`,
        errors: [
          {
            messageId: 'sameConditionalBlock',
            line: 7,
            data: {
              type: 'case',
              line: 3
            }
          },
          {
            messageId: 'sameConditionalBlock',
            line: 11,
            data: {
              type: 'case',
              line: 7
            }
          },
          {
            messageId: 'sameConditionalBlock',
            line: 15,
            data: {
              type: 'case',
              line: 11
            }
          }
        ]
      },
      {
        code: `
        switch(a) {
          case 1:
            doSomething();
            break;
          case 2:
            doSomething();
            break;
        }`,
        errors: [
          {
            messageId: 'sameConditionalBlock',
            line: 6,
            data: {
              type: 'case',
              line: 3
            }
          }
        ]
      },
      {
        code: `
        switch(a) {
          case 0:
            foo();
            bar();
            break;
          case 2:
          case 1:
            first();
            second();
            break;
          case 3:
            first();
            second();
            break;
        }`,
        errors: [
          {
            messageId: 'sameConditionalBlock',
            line: 12,
            data: {
              type: 'case',
              line: 8
            }
          }
        ]
      }
    ]
  });
});
