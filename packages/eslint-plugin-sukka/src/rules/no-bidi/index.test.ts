import { runTest } from '../../../../../lib/eslint-plugin-tester';
import module from '.';

runTest({
  module,
  *invalid() {
    yield {
      code: `
        const accessLevel = "user";
        if (accessLevel != "user\u202E \u2066// Check if admin\u2069 \u2066") {
          console.log("You are an admin.");
        }
      `,
      output: `
        const accessLevel = "user";
        if (accessLevel != "user\\u202E \\u2066// Check if admin\\u2069 \\u2066") {
          console.log("You are an admin.");
        }
      `,
      errors: [
        {
          messageId: 'detected',
          data: { kind: 'code', text: String.raw`"user\u202E \u2066// Check if admin\u2069 \u2066"` }
        }
      ]
    };
  }
});
