import { runTest } from '../../spec';
import module from './index';

runTest({
  module,
  *valid() {
    yield '// eslint-disable-next-line no-console -- Log a error';
  },
  *invalid() {
    yield {
      code: '// eslint-disable-next-line',
      errors: [{ messageId: 'require-description', data: { directive: 'eslint-disable-next-line' } }]
    };
  }
});
