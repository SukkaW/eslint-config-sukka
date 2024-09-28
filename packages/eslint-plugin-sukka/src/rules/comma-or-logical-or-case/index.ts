/*
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
// https://sonarsource.github.io/rspec/#/rspec/S3616/javascript

import { createRule } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

export default createRule({
  name: 'comma-or-logical-or-case',
  meta: {
    type: 'problem',
    docs: {
      description: 'Comma and logical OR operators should not be used in switch cases',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S3616/javascript'
    },
    schema: [],
    messages: {
      specifyCase: 'Explicitly specify {{nesting}} separate cases that fall through; currently this case clause only works for "{{expression}}".'
    }
  },
  create(context) {
    function reportIssue(node: TSESTree.Node, clause: TSESTree.Node, nestingLvl: number) {
      context.report({
        messageId: 'specifyCase',
        data: {
          nesting: nestingLvl.toString(),
          expression: String(getTextFromNode(clause))
        },
        node
      });
    }

    function getTextFromNode(node: TSESTree.Node) {
      if (node.type === AST_NODE_TYPES.Literal) {
        return node.value;
      }
      return context.sourceCode.getText(node);
    }

    function getEnclosingSwitchStatement(
      node: TSESTree.Node
    ): TSESTree.SwitchStatement {
      const ancestors = context.sourceCode.getAncestors(node);
      for (let i = ancestors.length - 1; i >= 0; i--) {
        if (ancestors[i].type === AST_NODE_TYPES.SwitchStatement) {
          return ancestors[i] as TSESTree.SwitchStatement;
        }
      }
      throw new Error('A switch case should have an enclosing switch statement');
    }

    return {
      'SwitchCase > SequenceExpression': function (node: TSESTree.SequenceExpression) {
        const expressions = node.expressions;
        reportIssue(node, expressions[expressions.length - 1], expressions.length);
      },
      'SwitchCase > LogicalExpression': function (node: TSESTree.LogicalExpression) {
        if (!isSwitchTrue(getEnclosingSwitchStatement(node))) {
          const firstElemAndNesting = getFirstElementAndNestingLevel(
            node,
            0
          );
          if (firstElemAndNesting) {
            reportIssue(node, firstElemAndNesting[0], firstElemAndNesting[1] + 1);
          }
        }
      }
    };
  }
});

function isSwitchTrue(node: TSESTree.SwitchStatement) {
  return node.discriminant.type === AST_NODE_TYPES.Literal && node.discriminant.value === true;
}

function getFirstElementAndNestingLevel(
  logicalExpression: TSESTree.LogicalExpression,
  currentLvl: number
): [TSESTree.Node, number] | undefined {
  if (logicalExpression.operator === '||') {
    if (logicalExpression.left.type === AST_NODE_TYPES.LogicalExpression) {
      return getFirstElementAndNestingLevel(logicalExpression.left, currentLvl + 1);
    }
    return [logicalExpression.left, currentLvl + 1];
  }
  return undefined;
}
