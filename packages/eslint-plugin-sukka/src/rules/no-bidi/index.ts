import { createRule } from '@eslint-sukka/shared';
import { escape, getFixer } from '@masknet/eslint-plugin/rules/unicode/specific-set.js';
import type { TSESTree } from '@typescript-eslint/types';
import { AST_TOKEN_TYPES } from '@typescript-eslint/types';

const BIDI_PATTERN = /[\u061C\u202A-\u202E\u2066-\u2069]/;

export default createRule({
  name: 'no-bidi',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Detect and stop Trojan Source attacks',
      recommended: 'recommended'
    },
    schema: [],
    messages: {
      detected: 'Detected potential trojan source attack with unicode bidi introduced in this {{kind}}: {{text}}.'
    }
  },
  create(context) {
    const onReport = (
      node: TSESTree.Token,
      kind: string
    ) => {
      const matcher = new RegExp(BIDI_PATTERN.source, 'gu');
      const data = { kind, text: escape(node.value, matcher) };
      const fix = getFixer(node, matcher);
      context.report({ node, data, messageId: 'detected', fix });
    };

    return {
      Program(program: TSESTree.Program) {
        for (const token of program.tokens ?? []) {
          const value = getValue(token);
          if (value === false) continue;
          if (!BIDI_PATTERN.test(value)) continue;
          onReport(token, 'code');
        }
        for (const comment of program.comments ?? []) {
          if (!BIDI_PATTERN.test(comment.value)) continue;
          onReport(comment, 'comment');
        }
      }
    };
  }
});

function getValue(token: TSESTree.Token) {
  switch (token.type) {
    case AST_TOKEN_TYPES.String:
    case AST_TOKEN_TYPES.Template: {
      return token.value.slice(1, -1);
    }
    case AST_TOKEN_TYPES.Identifier: {
      if (token.value.startsWith('#')) {
        return token.value.slice(1);
      }
      return token.value;
    }
    case AST_TOKEN_TYPES.RegularExpression: {
      if (token.regex) {
        return token.regex.pattern;
      }
      return false;
    }
    case AST_TOKEN_TYPES.JSXText:
    case AST_TOKEN_TYPES.JSXIdentifier: {
      return token.value;
    }
    default:
      return false;
  }
}
