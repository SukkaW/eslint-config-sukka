import { createRule } from '@eslint-sukka/shared';

type Options = boolean | 'allow-with-description';

const rDirective = /^\s*(?<directive>eslint-disable(?:-(?:next-)?line)?)/;

function getDirective(comment: string) {
  const matched = rDirective.exec(comment);
  return matched?.groups?.directive;
}

const rRuleId = /^eslint-disable(?:-next-line|-line)?(?<ruleId>$|(?:\s+(?:@(?:[\w-]+\/){1,2})?[\w-]+)?)/;

const matchNotFound = Symbol('rule-id-no-match');

function getRuleId(comment: string) {
  const matched = rRuleId.exec(comment.trim());
  if (!matched) return matchNotFound;
  return matched.groups?.ruleId;
}

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
        'Include a description after the `{{directive}}` directive to explain why the `{{directive}}` is necessary.',
      'require-specific-rule': 'Enforce specifying rules to disable in `eslint-disable` comments. If you want to disable ESLint on a file altogether, you should ignore it through ESLint configuration.'
    }
  },
  create(context, options: Options = 'allow-with-description') {
    if (options === false) return {};
    return {
      Program(program) {
        if (!program.comments || program.comments.length === 0) return;

        for (const comment of program.comments) {
          const directive = getDirective(comment.value);
          if (directive && (options !== 'allow-with-description' || !comment.value.includes('--'))) {
            const messageId = options === 'allow-with-description' ? 'require-description' : 'do-not-use';
            context.report({ node: comment, data: { directive }, messageId });
          }
          const ruleId = getRuleId(comment.value);
          if (ruleId !== matchNotFound && !ruleId) {
            context.report({ node: comment, messageId: 'require-specific-rule' });
          }
        }
      }
    };
  }
});
