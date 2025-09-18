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
// https://sonarsource.github.io/rspec/#/rspec/S4030

import type { TSESTree } from '@typescript-eslint/types';
import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { TSESLint } from '@typescript-eslint/utils';
import { createRule } from '@eslint-sukka/shared';
import { findFirstMatchingAncestor, isIdentifier, isReferenceTo } from '../no-empty-collection';
import { isElementWrite } from '../no-invariant-returns';

const collectionConstructor = ['Array', 'Map', 'Set', 'WeakSet', 'WeakMap'];
const writingMethods = [
  // array methods
  'copyWithin',
  'fill',
  'pop',
  'push',
  'reverse',
  'set',
  'shift',
  'sort',
  'splice',
  'unshift',
  // map, set methods
  'add',
  'clear',
  'delete'
];

export default createRule({
  name: 'no-unused-collection',
  meta: {
    schema: [],
    messages: {
      unusedCollection: 'Either use this collection\'s contents or remove the collection.'
    },
    type: 'suggestion',
    docs: {
      description: 'Collection contents should be used',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S4030/javascript',
      requiresTypeChecking: false
    }
  },
  create(context) {
    return {
      'Program:exit': (node) => {
        const unusedArrays: TSESLint.Scope.Variable[] = [];
        collectUnusedCollections(context.sourceCode.getScope(node), unusedArrays);

        unusedArrays.forEach(unusedArray => {
          context.report({
            messageId: 'unusedCollection',
            node: unusedArray.identifiers[0]
          });
        });
      }
    };
  }
});

function collectUnusedCollections(scope: TSESLint.Scope.Scope, unusedArray: TSESLint.Scope.Variable[]) {
  if (scope.type !== TSESLint.Scope.ScopeType.global) {
    scope.variables.forEach(v => {
      if (isUnusedCollection(v)) {
        unusedArray.push(v);
      }
    });
  }

  scope.childScopes.forEach(childScope => {
    collectUnusedCollections(childScope, unusedArray);
  });
}

function isExported(variable: TSESLint.Scope.Variable) {
  if (!variable.defs.length) {
    return;
  }
  const definition = variable.defs[0];
  return definition.node.parent?.parent?.type.startsWith('Export');
}

function isUnusedCollection(variable: TSESLint.Scope.Variable) {
  if (isExported(variable)) {
    return false;
  }
  if (variable.references.length <= 1) {
    return false;
  }

  // eslint-disable-next-line sukka/no-single-return -- fuck
  let assignCollection = false;

  for (const ref of variable.references) {
    if (ref.isWriteOnly()) {
      if (isReferenceAssigningCollection(ref)) {
        // eslint-disable-next-line sukka/no-single-return -- fuck
        assignCollection = true;
      } else {
        // One assignment is not a collection, we don't go further
        return false;
      }
    } else if (isRead(ref)) {
      // Unfortunately, isRead (!isWrite) from Scope.Reference consider A[1] = 1; and A.xxx(); as a read operation, we need to filter further
      return false;
    }
  }

  // eslint-disable-next-line sukka/no-single-return -- fuck
  return assignCollection;
}

function isReferenceAssigningCollection(ref: TSESLint.Scope.Reference) {
  const declOrExprStmt = findFirstMatchingAncestor(
    ref.identifier,
    n => n.type === AST_NODE_TYPES.VariableDeclarator || n.type === AST_NODE_TYPES.ExpressionStatement
  );
  if (declOrExprStmt) {
    if (declOrExprStmt.type === AST_NODE_TYPES.VariableDeclarator && declOrExprStmt.init) {
      return isCollectionType(declOrExprStmt.init);
    }

    if (declOrExprStmt.type === AST_NODE_TYPES.ExpressionStatement) {
      const { expression } = declOrExprStmt;
      return (
        expression.type === AST_NODE_TYPES.AssignmentExpression
        && isReferenceTo(ref, expression.left as TSESTree.Node)
        && isCollectionType(expression.right)
      );
    }
  }
  return false;
}

function isCollectionType(node: TSESTree.Node | null) {
  if (node && node.type === AST_NODE_TYPES.ArrayExpression) {
    return true;
  }
  if (node && (node.type === AST_NODE_TYPES.CallExpression || node.type === AST_NODE_TYPES.NewExpression)) {
    return isIdentifier(node.callee, ...collectionConstructor);
  }
  return false;
}

function isRead(ref: TSESLint.Scope.Reference) {
  const expressionStatement = findFirstMatchingAncestor(
    ref.identifier as TSESTree.Node,
    n => n.type === AST_NODE_TYPES.ExpressionStatement
  );

  if (expressionStatement) {
    return !isElementWrite(expressionStatement, ref, false) && !isWritingMethodCall(expressionStatement, ref);
  }

  // All the write statement that we search are part of ExpressionStatement, if there is none, it's a read
  return true;
}

/**
 * Detect expression statements like the following:
 * myArray.push(1);
 */
function isWritingMethodCall(statement: TSESTree.ExpressionStatement, ref: TSESLint.Scope.Reference) {
  if (statement.expression.type === AST_NODE_TYPES.CallExpression) {
    const { callee } = statement.expression;
    if (callee.type === AST_NODE_TYPES.MemberExpression) {
      const { property, object } = callee;
      return isReferenceTo(ref, object) && isIdentifier(property, ...writingMethods);
    }
  }
  return false;
}
