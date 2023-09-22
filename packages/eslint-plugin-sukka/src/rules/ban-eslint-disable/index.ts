import { createRule } from '../../utils/rule';

type Options = boolean | 'allow-with-description'

export default createRule({
  name: 'ban-eslint-disable',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ban `eslint-disable` comment directive'
    },
    schema: [{ oneOf: [{ type: 'boolean' }, { type: 'string', enum: ['allow-with-description'] }] }],
    messages: {
      'do-not-use': 'Do not use `{{directive}}`',
      'require-description':
        'Include a description after the `{{directive}}` directive to explain why the `{{directive}}` is necessary.'
    }
  },
  create(context, options: Options = 'allow-with-description') {
    if (options === false) return {};
    return {
      Program(program) {
        for (const comment of program.comments ?? []) {
          const directive = getDirective(comment.value);
          if (!directive) {
            continue;
          } else if (options === 'allow-with-description' && comment.value.includes('--')) {
            continue;
          }
          const messageId = options === 'allow-with-description' ? 'require-description' : 'do-not-use';
          context.report({ node: comment, data: { directive }, messageId });
        }
      }
    };
  }
});

function getDirective(comment: string) {
  const matched = /^\s*(?<directive>eslint-disable(?:-(?:next-)?line)?)/.exec(comment);
  return matched?.groups?.directive;
}
