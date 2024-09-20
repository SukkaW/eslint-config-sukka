import { runTest } from '../../../../../lib/eslint-plugin-tester';
import module from '.';
import type { MessageIds, Options } from '.';
import { dedent } from 'ts-dedent';

runTest<[Options], MessageIds>({
  module,
  valid: [
    {
      code: dedent`
        const obj = { // Comment
        x: 1
        };
      `
    },
    {
      code: dedent`
        const obj = {
        // Comment
        x: 1
        };
      `
    },
    {
      code: dedent`
        const obj = {
        x: 1 // Comment
        };
      `
    },
    {
      code: dedent`
        const obj = {
        x: 1, // Comment
        x: 2
        };
      `
    }
  ],
  invalid: [
    {
      options: [{ maxLineLength: 22 }],
      code: dedent`
        const obj1 = {
        x: 1
        };
        const obj2 = {
        x: 12
        };
      `,
      output: dedent`
        const obj1 = {x: 1};
        const obj2 = {
        x: 12
        };
      `,
      errors: [{ line: 1, endLine: 3, messageId: 'preferSingleLine' }]
    },
    {
      options: [{ maxLineLength: 25 }],
      code: dedent`
        const obj1 = f({
        x: 1
        });
        const obj2 = f({
        x: 12
        });
      `,
      output: dedent`
        const obj1 = f({x: 1});
        const obj2 = f({
        x: 12
        });
      `,
      errors: [{ line: 1, endLine: 3, messageId: 'preferSingleLine' }]
    },
    {
      options: [{ maxLineLength: 28 }],
      code: dedent`
        const obj1 = {
        x: 1,
        y: 2
        };
        const obj2 = {
        x: 1,
        y: 23
        };
      `,
      output: dedent`
        const obj1 = {x: 1,y: 2};
        const obj2 = {
        x: 1,
        y: 23
        };
      `,
      errors: [{ line: 1, endLine: 4, messageId: 'preferSingleLine' }]
    },
    {
      options: [{ maxObjectSize: 2 }],
      code: 'const obj = {x: 1,y: 2,y: 3};',
      output: dedent`
        const obj = {
        x: 1,
        y: 2,
        y: 3
        };
      `,
      errors: [{ line: 1, messageId: 'preferMultiline' }]
    },
    {
      options: [{ maxLineLength: 31 }],
      code: dedent`
        const obj1 = {
        x: 1
        } as const;
        const obj2 = {
        x: 12
        } as const;
      `,
      output: dedent`
        const obj1 = {x: 1} as const;
        const obj2 = {
        x: 12
        } as const;
      `,
      errors: [{ line: 1, endLine: 3, messageId: 'preferSingleLine' }]
    }
  ]
});
