import type { RuleFix } from '@typescript-eslint/utils/ts-eslint';
import { createRule } from '@eslint-sukka/shared';
import { detectEol } from 'foxts/detect-eol';
import type { TSESTree } from '@typescript-eslint/types';

export interface Options {
  maxLineLength?: number,
  maxObjectSize?: number
};

export type MessageIds = 'preferMultiline' | 'preferSingleLine';

export default createRule<Options, [Options], MessageIds>({
  name: 'object-format',
  meta: {
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        maxLineLength: {
          type: 'number',
          default: 80
        },
        maxObjectSize: {
          type: 'number',
          default: 3
        }
      },
      additionalProperties: false
    }] as const,
    docs: {
      description: 'Requires multiline or single-line object format.',
      recommended: 'stylistic'
    },
    messages: {
      preferMultiline: 'Prefer multiline object literal',
      preferSingleLine: 'Prefer single-line object literal'
    },
    type: 'layout'
  },
  create(context, options = {}) {
    const code = context.sourceCode.getText();

    function getText(
      mixed: /* [number, number] | */ TSESTree.Comment | TSESTree.Node | number
    ): string {
      if (typeof mixed === 'number') return code.slice(mixed);
      // if (Array.isArray(mixed)) return code.slice(...mixed);
      return code.slice(...mixed.range);
    }
    const getFullText = (node: TSESTree.Node) => code.slice(
      Math.min(node.range[0], ...context.sourceCode.getCommentsBefore(node).map(comment => comment.range[0])),
      node.range[1]
    );

    const eol = detectEol(code);
    const comma = ',';
    const commaEol = `,${eol}`;

    const { maxLineLength = 80, maxObjectSize = 3 } = options;

    const hasTrailingComment = createHasTrailingComment(code);

    return {
      ObjectExpression(node) {
        const texts = node.properties
          .map(property => getFullText(property).trim());

        if (texts.length > 0) {
          const text = context.sourceCode.getText(node);

          const expectMultiline = texts.length > maxObjectSize
            || texts.some(isMultilineString)
            || node.properties.some(hasTrailingComment);

          const expectSingleLine = !expectMultiline;

          const gotMultiline = isMultilineString(text);
          const gotSingleLine = isSingleLineString(text);

          if (expectMultiline && gotSingleLine) {
            context.report({
              fix(): RuleFix {
                return {
                  range: node.range,
                  text: `{${eol}${texts.join(commaEol)}${eol}}`
                };
              },
              messageId: 'preferMultiline',
              node
            });
          }

          if (
            expectSingleLine
            && gotMultiline
            && predictedLength() <= maxLineLength
          ) {
            context.report({
              fix(): RuleFix {
                return {
                  range: node.range,
                  text: `{${texts.join(comma)}}`
                };
              },
              messageId: 'preferSingleLine',
              node
            });
          }
        }

        function predictedLength(): number {
          const head = context.sourceCode.getLocFromIndex(node.range[0]).column;
          const contents = texts.reduce<number>((acc, cur) => acc + cur.length, 0);

          const commas = 2 * (texts.length - 1);

          const brackets = 4;

          const tail = getText(node.range[1])
            .split(/\r\n|\n/u)[0]
            // eslint-disable-next-line regexp/optimal-quantifier-concatenation -- Wait for https://github.com/ota-meshi/eslint-plugin-regexp/issues/451
            .replace(/^((?: as const)?\S*).*/u, '$1')
            .length;

          return head + contents + commas + brackets + tail;
        }
      }
    };
  }
});

function isMultilineString(str: string): boolean {
  return str.includes('\n');
}

function isSingleLineString(str: string): boolean {
  return !str.includes('\n');
}

function createHasTrailingComment(code: string) {
  return (node: TSESTree.BaseNode) => code
    .slice(node.range[1])
    .trimStart()
    .startsWith('//');
};
