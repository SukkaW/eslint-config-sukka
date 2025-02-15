import { createRule } from '@eslint-sukka/shared';
import type { RuleFix } from '@typescript-eslint/utils/ts-eslint';
import { detectEol } from 'foxts/detect-eol';

export type MessageId = 'unexpectedEmptyLine';

export default createRule({
  name: 'no-expression-empty-lines',
  meta: {
    messages: { unexpectedEmptyLine: 'Unexpected empty line before' },
    docs: {
      description: 'Disallows empty lines inside expressions.'
    },
    fixable: 'whitespace',
    type: 'suggestion',
    schema: []
  },
  create(context) {
    const code = context.sourceCode.getText();
    const eol = detectEol(code);

    return {
      MemberExpression(node) {
        const pos = node.object.range[1];

        const got = leadingSpaces(code.slice(pos));

        if (got.includes('\n')) {
          const expected = eol + trimLeadingEmptyLines(got);

          if (got !== expected) {
            context.report({
              fix(): RuleFix {
                return {
                  range: [pos, pos + got.length],
                  text: expected
                };
              },
              messageId: 'unexpectedEmptyLine',
              node: node.property
            });
          }
        }
      }
    };
  }
});

function leadingSpaces(str: string): string {
  return str.slice(0, str.length - str.trimStart().length);
}

function trimLeadingEmptyLines(str: string): string {
  const leadingLines = leadingSpaces(str).split(/\r\n|\n/u);

  return (leadingLines.at(-1) ?? '') + str.trimStart();
}
