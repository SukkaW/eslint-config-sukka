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
// https://sonarsource.github.io/rspec/#/rspec/S888/javascript

import { createRule } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const allEqualityOperators = new Set(['!=', '==', '!==', '===']);
const notEqualOperators = new Set(['!==', '!=']);
const plusMinusOperators = new Set(['+=', '-=']);

interface CompleteForStatement extends TSESTree.BaseNode {
  type: AST_NODE_TYPES.ForStatement,
  init?: TSESTree.VariableDeclaration | TSESTree.Expression | null,
  test: TSESTree.Expression,
  update: TSESTree.Expression,
  body: TSESTree.Statement
}

export default createRule({
  name: 'no-equals-in-for-termination',
  meta: {
    schema: [],
    messages: {
      replaceOperator:
        'Replace \'{{operator}}\' operator with one of \'<=\', \'>=\', \'<\', or \'>\' comparison operators.'
    },
    type: 'suggestion',
    docs: {
      description: 'Equality operators should not be used in "for" loop termination conditions',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S888/javascript'
    }
  },
  create(context) {
    function isException(forStatement: CompleteForStatement) {
      return (
        isNontrivialConditionException(forStatement)
        || isTrivialIteratorException(forStatement)
      );
    }

    function isTrivialIteratorException(forStatement: CompleteForStatement) {
      const init = forStatement.init;
      const condition = forStatement.test;

      if (init && isNotEqual(condition)) {
        const updatedByOne = checkForUpdateByOne(forStatement.update, forStatement.body);
        if (updatedByOne !== 0) {
          const beginValue = getValue(init);
          const endValue = getValue(condition);
          return (
            beginValue !== undefined
            && endValue !== undefined
            && updatedByOne === Math.sign(endValue - beginValue)
          );
        }
      }

      return false;
    }

    function checkForUpdateByOne(
      update: TSESTree.Expression,
      loopBody: TSESTree.Node
    ) {
      if (isUpdateByOne(update, loopBody)) {
        if (update.operator === '++' || update.operator === '+=') {
          return +1;
        }
        if (update.operator === '--' || update.operator === '-=') {
          return -1;
        }
      }
      return 0;
    }

    function isUpdateByOne(
      update: TSESTree.Expression,
      loopBody: TSESTree.Node
    ): update is TSESTree.UpdateExpression | TSESTree.AssignmentExpression {
      return (
        (update.type === AST_NODE_TYPES.UpdateExpression && !isUsedInsideBody(update.argument, loopBody))
        || (isUpdateOnOneWithAssign(update) && !isUsedInsideBody(update.left, loopBody))
      );
    }

    function getVariableFromName(name: string, node: TSESTree.Node) {
      const scope: TSESLint.Scope.Scope | null = context.sourceCode.getScope(node);
      return getVariableFromScope(scope, name);
    }

    function isUsedInsideBody(id: TSESTree.Node, loopBody: TSESTree.Node) {
      if (id.type === AST_NODE_TYPES.Identifier) {
        const variable = getVariableFromName(id.name, id);
        const bodyRange = loopBody.range;
        if (variable && bodyRange) {
          return variable.references.some(ref => isInBody(ref.identifier, bodyRange));
        }
      }
      return false;
    }

    return {
      ForStatement(node: TSESTree.Node) {
        const forStatement = node as TSESTree.ForStatement;
        if (!forStatement.test || !forStatement.update) {
          return;
        }
        const completeForStatement = node as CompleteForStatement;
        const condition = completeForStatement.test;
        if (
          isEquality(condition)
          && isUpdateIncDec(completeForStatement.update)
          && !isException(completeForStatement)
        ) {
          context.report({
            messageId: 'replaceOperator',
            data: {
              operator: condition.operator
            },
            node: condition
          });
        }
      }
    };
  }
});

function getVariableFromScope(scope: TSESLint.Scope.Scope | null, name: string) {
  let variable;
  while (variable == null && scope != null) {
    variable = scope.variables.find(value => value.name === name);
    scope = scope.upper;
  }
  return variable;
}

function isEquality(expression: TSESTree.Expression): expression is TSESTree.BinaryExpression {
  return (
    expression.type === AST_NODE_TYPES.BinaryExpression && allEqualityOperators.has(expression.operator)
  );
}

function isUpdateIncDec(expression: TSESTree.Expression): boolean {
  if (isIncDec(expression) || expression.type === AST_NODE_TYPES.UpdateExpression) {
    return true;
  } if (expression.type === AST_NODE_TYPES.SequenceExpression) {
    return expression.expressions.every(isUpdateIncDec);
  }
  return false;
}

function isIncDec(expression: TSESTree.Expression): expression is TSESTree.AssignmentExpression {
  return (
    expression.type === AST_NODE_TYPES.AssignmentExpression && plusMinusOperators.has(expression.operator)
  );
}

function isNontrivialConditionException(forStatement: CompleteForStatement) {
  // If we reach this point, we know that test is an equality kind
  const condition = forStatement.test as TSESTree.BinaryExpression;
  const counters: string[] = [];
  collectCounters(forStatement.update, counters);
  return condition.left.type !== AST_NODE_TYPES.Identifier || !counters.includes(condition.left.name);
}

function collectCounters(expression: TSESTree.Expression, counters: string[]) {
  let counter: TSESTree.Node | null | undefined;

  if (isIncDec(expression)) {
    counter = expression.left;
  } else if (expression.type === AST_NODE_TYPES.UpdateExpression) {
    counter = expression.argument;
  } else if (expression.type === AST_NODE_TYPES.SequenceExpression) {
    expression.expressions.forEach(e => collectCounters(e, counters));
  }

  if (counter && counter.type === AST_NODE_TYPES.Identifier) {
    counters.push(counter.name);
  }
}

function isNotEqual(node: TSESTree.Node): node is TSESTree.BinaryExpression {
  return node.type === AST_NODE_TYPES.BinaryExpression && notEqualOperators.has(node.operator);
}

function isInBody(id: TSESTree.Identifier | TSESTree.JSXIdentifier, bodyRange: [number, number]) {
  return id.range && id.range[0] > bodyRange[0] && id.range[1] < bodyRange[1];
}

function getValue(node: TSESTree.Node) {
  if (isNotEqual(node)) {
    return getInteger(node.right);
  } if (isOneVarDeclaration(node)) {
    const variable = node.declarations[0];
    return getInteger(variable.init);
  } if (node.type === AST_NODE_TYPES.AssignmentExpression) {
    return getInteger(node.right);
  }
}

function getInteger(node: TSESTree.Node | undefined | null) {
  if (node && node.type === AST_NODE_TYPES.Literal && typeof node.value === 'number') {
    return node.value;
  }
}

function isOneVarDeclaration(node: TSESTree.Node): node is TSESTree.VariableDeclaration {
  return node.type === AST_NODE_TYPES.VariableDeclaration && node.declarations.length === 1;
}

function isUpdateOnOneWithAssign(
  expression: TSESTree.Expression
): expression is TSESTree.AssignmentExpression {
  if (isIncDec(expression)) {
    const right = expression.right;
    return right.type === AST_NODE_TYPES.Literal && right.value === 1;
  }
  return false;
}
