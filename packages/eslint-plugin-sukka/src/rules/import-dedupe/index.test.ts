import { runTest } from '../../../../../lib/eslint-plugin-tester';
import module from './index';

runTest({
  module,
  *valid() {
    yield 'import { a } from \'foo\'';
  },
  *invalid() {
    yield {
      code: 'import { a, b, a, a, c, a } from \'foo\'',
      errors: [{ messageId: 'import-dedupe' }, { messageId: 'import-dedupe' }, { messageId: 'import-dedupe' }],
      output: 'import { a, b,   c,  } from \'foo\''
    };
  }
});
