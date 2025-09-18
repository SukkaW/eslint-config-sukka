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

import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { TSESTree } from '@typescript-eslint/types';
import type { TSESLint } from '@typescript-eslint/utils';
import { createRule } from '@eslint-sukka/shared';
import { collectSwitchBranches } from '../no-all-duplicated-branches';

export default createRule({
  name: 'no-duplicated-branches',
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description:
        'Two branches in a conditional structure should not have exactly the same implementation',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S1871/javascript'
    },
    messages: {
      sameConditionalBlock: 'This {{type}}\'s code block is the same as the block for the {{type}} on line {{line}}.'
    }
  },
  create(context) {
    return {
      IfStatement(node: TSESTree.IfStatement) {
        visitIfStatement(node);
      },
      SwitchStatement(node: TSESTree.SwitchStatement) {
        visitSwitchStatement(node);
      }
    };

    function visitIfStatement(ifStmt: TSESTree.IfStatement) {
      if (ifStmt.parent.type === AST_NODE_TYPES.IfStatement) {
        return;
      }
      const { branches, endsWithElse } = collectIfBranches(ifStmt);

      if (allEquivalentWithoutDefault(branches, endsWithElse)) {
        branches.slice(1).forEach((branch, i) => reportIssue(branch, branches[i], 'branch'));
        return;
      }

      for (let i = 1; i < branches.length; i++) {
        if (hasRequiredSize([branches[i]])) {
          for (let j = 0; j < i; j++) {
            if (compareIfBranches(branches[i], branches[j])) {
              break;
            }
          }
        }
      }
    }

    function visitSwitchStatement(switchStmt: TSESTree.SwitchStatement) {
      const { cases } = switchStmt;
      const { endsWithDefault } = collectSwitchBranches(switchStmt);
      const nonEmptyCases = cases.filter(
        c => takeWithoutBreak(expandSingleBlockStatement(c.consequent)).length > 0
      );
      const casesWithoutBreak = nonEmptyCases.map(c => takeWithoutBreak(expandSingleBlockStatement(c.consequent)));

      if (allEquivalentWithoutDefault(casesWithoutBreak, endsWithDefault)) {
        nonEmptyCases
          .slice(1)
          .forEach((caseStmt, i) => reportIssue(caseStmt, nonEmptyCases[i], 'case'));
        return;
      }

      for (let i = 1; i < cases.length; i++) {
        const firstClauseWithoutBreak = takeWithoutBreak(
          expandSingleBlockStatement(cases[i].consequent)
        );

        if (hasRequiredSize(firstClauseWithoutBreak)) {
          for (let j = 0; j < i; j++) {
            const secondClauseWithoutBreak = takeWithoutBreak(
              expandSingleBlockStatement(cases[j].consequent)
            );

            if (
              areEquivalent(firstClauseWithoutBreak, secondClauseWithoutBreak, context.sourceCode)
            ) {
              reportIssue(cases[i], cases[j], 'case');
              break;
            }
          }
        }
      }
    }

    function hasRequiredSize(nodes: TSESTree.Statement[]) {
      if (nodes.length > 0) {
        const tokens = [
          ...context.sourceCode.getTokens(nodes[0]),
          ...context.sourceCode.getTokens(nodes[nodes.length - 1])
        ].filter(token => token.value !== '{' && token.value !== '}');
        return (
          tokens.length > 0 && tokens[tokens.length - 1].loc.end.line > tokens[0].loc.start.line
        );
      }
      return false;
    }

    function compareIfBranches(a: TSESTree.Statement, b: TSESTree.Statement) {
      const equivalent = areEquivalent(a, b, context.sourceCode);
      if (equivalent && 'loc' in b) {
        reportIssue(a, b, 'branch');
      }
      return equivalent;
    }

    function allEquivalentWithoutDefault(
      branches: Array<TSESTree.Node | TSESTree.Node[]>,
      endsWithDefault: boolean
    ) {
      return (
        !endsWithDefault
        && branches.length > 1
        && branches
          .slice(1)
          .every((branch, index) => areEquivalent(branch, branches[index], context.sourceCode))
      );
    }

    function reportIssue(node: TSESTree.Node, equivalentNode: TSESTree.Node, type: string) {
      const equivalentNodeLoc = (equivalentNode).loc;
      context.report({
        messageId: 'sameConditionalBlock',
        data: { type, line: String(equivalentNodeLoc.start.line) },
        node
      });
    }
  }
});

function expandSingleBlockStatement(nodes: TSESTree.Statement[]) {
  if (nodes.length === 1) {
    const node = nodes[0];
    if (node.type === AST_NODE_TYPES.BlockStatement) {
      return node.body;
    }
  }
  return nodes;
}

/**
 * Equivalence is implemented by comparing node types and their tokens.
 * Classic implementation would recursively compare children,
 * but "estree" doesn't provide access to children when node type is unknown
 */
function areEquivalent(
  first: TSESTree.Node | TSESTree.Node[],
  second: TSESTree.Node | TSESTree.Node[],
  sourceCode: TSESLint.SourceCode
): boolean {
  if (Array.isArray(first) && Array.isArray(second)) {
    return (
      first.length === second.length
      && first.every((firstNode, index) => areEquivalent(firstNode, second[index], sourceCode))
    );
  }
  if (!Array.isArray(first) && !Array.isArray(second)) {
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

/** Excludes the break statement from the list */
function takeWithoutBreak(nodes: TSESTree.Statement[]) {
  return nodes.length > 0 && nodes[nodes.length - 1].type === AST_NODE_TYPES.BreakStatement
    ? nodes.slice(0, -1)
    : nodes;
}
