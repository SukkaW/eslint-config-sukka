import { runTest } from '@eslint-sukka/internal';
import module from '.';
import { dedent } from 'ts-dedent';

runTest({
  module,
  valid: [
    '[].reduce(() => {}, 0);',
    '[].map(() => {});',
    '[].filter(() => {});',
    '[].reduce(() => {}, 0).sort();',
    '[].filter(() => {}).every(() => true);'
  ],
  invalid: [
    {
      code: '[].map(() => {}).filter(() => {}, 0);',
      errors: [{
        messageId: 'detected'
      }]
    },
    {
      code: '[].filter(() => {}).map(() => {}, 0);',
      errors: [{
        messageId: 'detected'
      }]
    },
    {
      code: dedent`
        []
          .map(() => {})
          .reduce(() => {}, 0);
      `,
      errors: [{
        messageId: 'detected'
      }]
    },
    {
      code: dedent`
        arr
          .reduce(() => {}, 0)
          .map(() => {});
      `,
      errors: [{
        messageId: 'detected'
      }]
    },
    {
      code: dedent`
        arr
          .map(() => {})
          .filter(() => {}, 0);
      `,
      errors: [{
        messageId: 'detected'
      }]
    }
  ]
});
