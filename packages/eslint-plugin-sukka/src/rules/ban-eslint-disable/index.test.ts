import { runTest } from '../../../../../lib/eslint-plugin-tester';
import module from './index';

runTest({
  module,
  *valid() {
    yield '// eslint-disable-next-line no-console -- Log a error\nconsole.log()';
  },
  *invalid() {
    yield {
      code: '// eslint-disable-next-line\nconsole.log()',
      errors: [
        { messageId: 'require-description', data: { directive: 'eslint-disable-next-line' } },
        { messageId: 'require-specific-rule' }
      ]
    };
  }
});
