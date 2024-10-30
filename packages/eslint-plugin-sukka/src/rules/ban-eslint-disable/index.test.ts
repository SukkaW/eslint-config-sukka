import { runTest } from '@eslint-sukka/internal';
import module from './index';

runTest({
  module,
  *valid() {
    yield '// eslint-disable-next-line no-console -- Log an error\nconsole.log(``)';
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
