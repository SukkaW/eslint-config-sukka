/**
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://sonarsource.github.io/rspec/#/rspec/S1472/javascript

import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/types';
import type { TSESTree } from '@typescript-eslint/types';
import { createRule } from '@eslint-sukka/shared';

export default createRule({
  name: 'call-argument-line',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Function call arguments should not start on new lines',
      recommended: 'recommended'
    },
    schema: [],
    messages: {
      moveArguments: 'Make those call arguments start on line {{line}}.',
      moveTemplateLiteral: 'Make this template literal start on line {{line}}.'
    }
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      CallExpression(call) {
        if (call.callee.type !== AST_NODE_TYPES.CallExpression && call.arguments.length === 1) {
          const callee = getCallee(call);
          const parenthesis = sourceCode.getLastTokenBetween(
            callee,
            call.arguments[0],
            isClosingParen
          );
          const calleeLastLine = (parenthesis ?? sourceCode.getLastToken(callee))!.loc.end.line;
          const { start } = sourceCode.getTokenAfter(callee, isNotClosingParen)!.loc;
          if (calleeLastLine !== start.line) {
            const { end } = sourceCode.getLastToken(call)!.loc;
            if (end.line === start.line) {
              context.report({
                messageId: 'moveArguments',
                data: {
                  line: calleeLastLine.toString()
                },
                loc: { start, end }
              });
            } else {
              // If arguments span multiple lines, we only report the first one
              context.report({
                messageId: 'moveArguments',
                data: {
                  line: calleeLastLine.toString()
                },
                loc: start
              });
            }
          }
        }
      },
      TaggedTemplateExpression(node) {
        const { quasi } = node;
        const tokenBefore = sourceCode.getTokenBefore(quasi);
        if (tokenBefore && quasi.loc && tokenBefore.loc.end.line !== quasi.loc.start.line) {
          const loc = {
            start: quasi.loc.start,
            end: {
              line: quasi.loc.start.line,
              column: quasi.loc.start.column + 1
            }
          };
          context.report({
            messageId: 'moveTemplateLiteral',
            data: {
              line: tokenBefore.loc.start.line.toString()
            },
            loc
          });
        }
      }
    };
  }
});

function getCallee(call: TSESTree.CallExpression) {
  const node = call;
  return (node.typeArguments ?? node.callee) as TSESTree.Node;
}

function isClosingParen(token: TSESTree.Token): token is TSESTree.PunctuatorToken {
  return token.type === AST_TOKEN_TYPES.Punctuator && token.value === ')';
}

function isNotClosingParen(token: TSESTree.Token): boolean {
  return !isClosingParen(token);
}
