import module from './index';
import { runTest } from '../../../../../lib/eslint-plugin-tester';

runTest({
  module,
  *valid() {
    yield 'enum E {}';
  },
  *invalid() {
    yield {
      code: 'const enum E {}',
      errors: [{ messageId: 'noConstEnum' }]
    };
  }
});
