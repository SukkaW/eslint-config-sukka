import module from '.';
import { runTest } from '@eslint-sukka/internal';
import { dedent } from 'ts-dedent';

runTest({
  module,
  *valid() {
    yield 'enum E {}';
    yield 'const enum E {}';
  },
  *invalid() {
    yield {
      code: 'export const enum E {}',
      errors: [{ messageId: 'noConstEnum' }]
    };
    yield {
      code: dedent`
        const enum A {
          MB = 'MiB'
        };
        export const A;
      `,
      errors: [{ messageId: 'noConstEnum' }]
    };
    yield {
      code: dedent`
        const enum A {
          MB = 'MiB'
        };
        export default A;
      `,
      errors: [{ messageId: 'noConstEnum' }]
    };
  }
});
