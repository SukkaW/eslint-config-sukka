import { runTest } from '@eslint-sukka/internal';
import module from '.';
import { dedent } from 'ts-dedent';

runTest({
  module,
  *valid() {
    yield dedent`
      const result = []
        .map(x => x)
        .map(x => x);
    `;
    yield dedent`
      const result = []
        // comment
        .map(x => x) // comment
        .map(x => x);
    `;
  },
  *invalid() {
    yield {
      code: dedent`
        const result = []

          .map(x => x)


          .map(x => x);
      `,
      output: dedent`
        const result = []
          .map(x => x)
          .map(x => x);
      `,
      errors: [
        { messageId: 'unexpectedEmptyLine' },
        { messageId: 'unexpectedEmptyLine' }
      ]
    };
  }
});
