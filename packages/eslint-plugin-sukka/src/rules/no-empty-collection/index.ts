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
// https://sonarsource.github.io/rspec/#/rspec/S4158

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';
import { createRule } from '@eslint-sukka/shared';

// Methods that mutate the collection but can't add elements
const nonAdditiveMutatorMethods = [
  // array methods
  'copyWithin',
  'pop',
  'reverse',
  'shift',
  'sort',
  // map, set methods
  'clear',
  'delete'
];
const accessorMethods = [
  // array methods
  'concat',
  'flat',
  'flatMap',
  'includes',
  'indexOf',
  'join',
  'lastIndexOf',
  'slice',
  'toSource',
  'toString',
  'toLocaleString',
  // map, set methods
  'get',
  'has'
];
const iterationMethods = [
  'entries',
  'every',
  'filter',
  'find',
  'findIndex',
  'forEach',
  'keys',
  'map',
  'reduce',
  'reduceRight',
  'some',
  'values'
];

const collectionConstructor = ['Array', 'Map', 'Set', 'WeakSet', 'WeakMap'];

const strictlyReadingMethods = new Set([
  ...nonAdditiveMutatorMethods,
  ...accessorMethods,
  ...iterationMethods
]);

export default createRule({
  name: 'no-empty-collection',
  meta: {
    schema: [],
    type: 'problem',
    docs: {
      description: 'Empty collections should not be accessed or iterated',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S4158/javascript'
    },
    messages: {
      reviewUsageOfIdentifier: 'Review this usage of "{{identifierName}}" as it can only be empty here.'
    }
  },
  create(context) {
    const reportEmptyCollectionUsage = (variable: TSESLint.Scope.Variable) => {
      if (variable.references.length <= 1) {
        return;
      }

      if (variable.defs.some(d => d.type === TSESLint.Scope.DefinitionType.Parameter || d.type === TSESLint.Scope.DefinitionType.ImportBinding)) {
        // Bound value initialized elsewhere, could be non-empty.
        return;
      }

      const readingUsages: TSESLint.Scope.Reference[] = [];
      let hasAssignmentOfEmptyCollection = false;

      for (const ref of variable.references) {
        if (ref.isWriteOnly()) {
          if (isReferenceAssigningEmptyCollection(ref)) {
            hasAssignmentOfEmptyCollection = true;
          } else {
            // There is at least one operation that might make the collection non-empty.
            // We ignore the order of usages, and consider all reads to be safe.
            return;
          }
        } else if (isReadingCollectionUsage(ref)) {
          readingUsages.push(ref);
        } else {
          // some unknown operation on the collection.
          // To avoid any FPs, we assume that it could make the collection non-empty.
          return;
        }
      }

      if (hasAssignmentOfEmptyCollection) {
        readingUsages.forEach(ref => {
          context.report({
            messageId: 'reviewUsageOfIdentifier',
            data: {
              identifierName: ref.identifier.name
            },
            node: ref.identifier
          });
        });
      }
    };

    const reportEmptyCollectionsUsage = (scope: TSESLint.Scope.Scope) => {
      if (scope.type !== TSESLint.Scope.ScopeType.global) {
        scope.variables.forEach(reportEmptyCollectionUsage);
      }

      scope.childScopes.forEach(reportEmptyCollectionsUsage);
    };

    return {
      'Program:exit': (node) => {
        reportEmptyCollectionsUsage(context.sourceCode.getScope(node));
      }
    };
  }
});

export function findFirstMatchingAncestor(
  node: TSESTree.Node,
  predicate: (node: TSESTree.Node) => boolean
) {
  return ancestorsChain(node, new Set()).find(predicate);
}

function ancestorsChain(node: TSESTree.Node, boundaryTypes: Set<string>) {
  const chain: TSESTree.Node[] = [];

  let currentNode = node.parent;
  while (currentNode) {
    chain.push(currentNode);
    if (boundaryTypes.has(currentNode.type)) {
      break;
    }
    currentNode = currentNode.parent;
  }
  return chain;
}

function isReferenceAssigningEmptyCollection(ref: TSESLint.Scope.Reference) {
  const declOrExprStmt = findFirstMatchingAncestor(
    ref.identifier,
    n => n.type === AST_NODE_TYPES.VariableDeclarator || n.type === AST_NODE_TYPES.ExpressionStatement
  );
  if (declOrExprStmt) {
    if (declOrExprStmt.type === AST_NODE_TYPES.VariableDeclarator && declOrExprStmt.init) {
      return isEmptyCollectionType(declOrExprStmt.init);
    }

    if (declOrExprStmt.type === AST_NODE_TYPES.ExpressionStatement) {
      const { expression } = declOrExprStmt;
      return (
        expression.type === AST_NODE_TYPES.AssignmentExpression
        && isReferenceTo(ref, expression.left)
        && isEmptyCollectionType(expression.right)
      );
    }
  }
  return false;
}

export function isReferenceTo(ref: TSESLint.Scope.Reference, node: TSESTree.Node) {
  return node.type === AST_NODE_TYPES.Identifier && node === ref.identifier;
}

function isEmptyCollectionType(node: TSESTree.Node | undefined) {
  if (node && node.type === AST_NODE_TYPES.ArrayExpression) {
    return node.elements.length === 0;
  }
  if (node && (node.type === AST_NODE_TYPES.CallExpression || node.type === AST_NODE_TYPES.NewExpression)) {
    return isIdentifier(node.callee, ...collectionConstructor) && node.arguments.length === 0;
  }
  return false;
}

function isReadingCollectionUsage(ref: TSESLint.Scope.Reference) {
  return isStrictlyReadingMethodCall(ref) || isForIterationPattern(ref) || isElementRead(ref);
}

export function isIdentifier(
  node: TSESTree.Node | undefined,
  ...values: string[]
): node is TSESTree.Identifier {
  return (
    node?.type === AST_NODE_TYPES.Identifier
    && (values.length === 0 || values.some(value => value === node.name))
  );
}

function isStrictlyReadingMethodCall(usage: TSESLint.Scope.Reference) {
  const { parent } = usage.identifier;
  if ((parent as TSESTree.Node | undefined) && parent.type === AST_NODE_TYPES.MemberExpression) {
    const memberExpressionParent = parent.parent as TSESTree.Node | undefined;
    if (memberExpressionParent && memberExpressionParent.type === AST_NODE_TYPES.CallExpression) {
      return isIdentifier(parent.property, ...strictlyReadingMethods);
    }
  }
  return false;
}

function isForIterationPattern(ref: TSESLint.Scope.Reference) {
  const forInOrOfStatement = findFirstMatchingAncestor(
    ref.identifier,
    n => n.type === AST_NODE_TYPES.ForOfStatement || n.type === AST_NODE_TYPES.ForInStatement
  ) as TSESTree.ForOfStatement | TSESTree.ForInStatement | undefined;

  return forInOrOfStatement && forInOrOfStatement.right === ref.identifier;
}

function isElementRead(ref: TSESLint.Scope.Reference) {
  const { parent } = ref.identifier;
  return (
    (parent as TSESTree.Node | undefined)
    && parent.type === AST_NODE_TYPES.MemberExpression
    && parent.computed
    && !isElementWrite(parent)
  );
}

export function isElementWrite(memberExpression: TSESTree.MemberExpression) {
  const ancestors = ancestorsChain(memberExpression, new Set());
  const assignment = ancestors.find(
    n => n.type === AST_NODE_TYPES.AssignmentExpression
  );
  if (assignment && assignment.operator === '=') {
    return [memberExpression, ...ancestors].includes(assignment.left);
  }
  return false;
}
