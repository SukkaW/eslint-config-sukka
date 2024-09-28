/*
 * eslint-plugin-sonarjs
 * Copyright (C) 2018-2021 SonarSource SA
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
// https://sonarsource.github.io/rspec/#/rspec/S3923

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createRule } from '@eslint-sukka/shared';

export default createRule({
  name: 'no-all-duplicated-branches',
  meta: {
    messages: {
      removeOrEditConditionalStructure:
        'Remove this conditional structure or edit its code blocks so that they\'re not all the same.',
      returnsTheSameValue:
        'This conditional operation returns the same value whether the condition is "true" or "false".'
    },
    schema: [],
    type: 'problem',
    docs: {
      description:
        'All branches in a conditional structure should not have exactly the same implementation',
      recommended: 'recommended'
    }
  },
  create(context) {
    return {
      IfStatement(node: TSESTree.Node) {
        const ifStmt = node as TSESTree.IfStatement;

        // don't visit `else if` statements
        if (node.parent?.type !== AST_NODE_TYPES.IfStatement) {
          const { branches, endsWithElse } = collectIfBranches(ifStmt);
          if (endsWithElse && allDuplicated(branches)) {
            context.report({ messageId: 'removeOrEditConditionalStructure', node: ifStmt });
          }
        }
      },

      SwitchStatement(node: TSESTree.Node) {
        const switchStmt = node as TSESTree.SwitchStatement;
        const { branches, endsWithDefault } = collectSwitchBranches(switchStmt);
        if (endsWithDefault && allDuplicated(branches)) {
          context.report({ messageId: 'removeOrEditConditionalStructure', node: switchStmt });
        }
      },

      ConditionalExpression(node: TSESTree.Node) {
        const conditional = node as TSESTree.ConditionalExpression;
        const branches = [conditional.consequent, conditional.alternate];
        if (allDuplicated(branches)) {
          context.report({ messageId: 'returnsTheSameValue', node: conditional });
        }
      }
    };

    function allDuplicated(branches: Array<TSESTree.Node | TSESTree.Node[]>) {
      return (
        branches.length > 1
        && branches.slice(1).every((branch, index) => areEquivalent(branch, branches[index], context.sourceCode))
      );
    }
  }
});

/**
 * Equivalence is implemented by comparing node types and their tokens.
 * Classic implementation would recursively compare children,
 * but "estree" doesn't provide access to children when node type is unknown
 */
export function areEquivalent(
  first: TSESTree.Node | TSESTree.Node[],
  second: TSESTree.Node | TSESTree.Node[],
  sourceCode: TSESLint.SourceCode
): boolean {
  if (Array.isArray(first) && Array.isArray(second)) {
    return (
      first.length === second.length
      && first.every((firstNode, index) => areEquivalent(firstNode, second[index], sourceCode))
    );
  } if (!Array.isArray(first) && !Array.isArray(second)) {
    return (
      first.type === second.type
      && compareTokens(sourceCode.getTokens(first), sourceCode.getTokens(second))
    );
  }
  return false;
}

function compareTokens(firstTokens: TSESLint.AST.Token[], secondTokens: TSESLint.AST.Token[]) {
  return (
    firstTokens.length === secondTokens.length
    && firstTokens.every((firstToken, index) => firstToken.value === secondTokens[index].value)
  );
}

/** Returns a list of statements corresponding to a `if - else if - else` chain */
function collectIfBranches(node: TSESTree.IfStatement) {
  const branches: TSESTree.Statement[] = [node.consequent];
  let endsWithElse = false;
  let statement = node.alternate;

  while (statement) {
    if (statement.type === AST_NODE_TYPES.IfStatement) {
      branches.push(statement.consequent);
      statement = statement.alternate;
    } else {
      branches.push(statement);
      endsWithElse = true;
      break;
    }
  }

  return { branches, endsWithElse };
}

/** Returns a list of `switch` clauses (both `case` and `default`) */
function collectSwitchBranches(node: TSESTree.SwitchStatement) {
  let endsWithDefault = false;
  const branches = node.cases
    .filter((clause, index) => {
      if (!clause.test) {
        endsWithDefault = true;
      }
      // if a branch has no implementation, it's fall-through and it should not be considered
      // the only exception is the last case
      const isLast = index === node.cases.length - 1;
      return isLast || clause.consequent.length > 0;
    })
    .map(clause => takeWithoutBreak(clause.consequent));
  return { branches, endsWithDefault };
}

/** Excludes the break statement from the list */
function takeWithoutBreak(nodes: TSESTree.Statement[]) {
  return nodes.length > 0 && nodes[nodes.length - 1].type === AST_NODE_TYPES.BreakStatement
    ? nodes.slice(0, -1)
    : nodes;
}
