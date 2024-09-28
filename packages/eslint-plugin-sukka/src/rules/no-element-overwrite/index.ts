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
// https://sonarsource.github.io/rspec/#/rspec/S4143

import { createRule } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { areEquivalent } from '../no-all-duplicated-branches';

export default createRule({
  name: 'no-element-overwrite',
  meta: {
    schema: [],
    type: 'problem',
    docs: {
      description: 'Collection elements should not be replaced unconditionally',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S4143/javascript'
    },
    messages: {
      verifyIntendedIndex: 'Verify this is the index that was intended; "{{index}}" was already set on line {{line}}.'
    }
  },
  create(context) {
    return {
      SwitchCase(node) {
        checkStatements(node.consequent);
      },

      BlockStatement(node) {
        checkStatements(node.body);
      },

      Program(node) {
        checkStatements(getProgramStatements(node));
      }
    };

    function checkStatements(statements: TSESTree.Statement[]) {
      const usedKeys = new Map<string, KeyWriteCollectionUsage>();
      let collection: TSESTree.Node | undefined;
      statements.forEach(statement => {
        const keyWriteUsage = getKeyWriteUsage(statement);
        if (keyWriteUsage) {
          if (
            collection
            && !areEquivalent(keyWriteUsage.collectionNode, collection, context.sourceCode)
          ) {
            usedKeys.clear();
          }
          const sameKeyWriteUsage = usedKeys.get(keyWriteUsage.indexOrKey);
          if (sameKeyWriteUsage?.node.loc) {
            context.report({
              node: keyWriteUsage.node,
              messageId: 'verifyIntendedIndex',
              data: {
                index: keyWriteUsage.indexOrKey,
                line: sameKeyWriteUsage.node.loc.start.line
              }
            });
          }
          usedKeys.set(keyWriteUsage.indexOrKey, keyWriteUsage);
          collection = keyWriteUsage.collectionNode;
        } else {
          usedKeys.clear();
        }
      });
    }

    function getKeyWriteUsage(node: TSESTree.Node): KeyWriteCollectionUsage | undefined {
      if (node.type === AST_NODE_TYPES.ExpressionStatement) {
        return arrayKeyWriteUsage(node.expression) || mapOrSetKeyWriteUsage(node.expression);
      }
      return undefined;
    }

    function arrayKeyWriteUsage(node: TSESTree.Node): KeyWriteCollectionUsage | undefined {
      // a[b] = ...
      if (
        isSimpleAssignment(node)
        && node.left.type === AST_NODE_TYPES.MemberExpression
        && node.left.computed
      ) {
        const { left, right } = node;
        const index = extractIndex(left.property);
        if (index !== undefined && !isUsed(left.object, right)) {
          return {
            collectionNode: left.object,
            indexOrKey: index,
            node
          };
        }
      }
      return undefined;
    }

    function isUsed(value: TSESTree.Node, expression: TSESTree.Expression) {
      const valueTokens = context.sourceCode.getTokens(value);
      const expressionTokens = context.sourceCode.getTokens(expression);

      const foundUsage = expressionTokens.find((token, index) => {
        if (eq(token, valueTokens[0])) {
          for (
            let expressionIndex = index, valueIndex = 0;
            expressionIndex < expressionTokens.length && valueIndex < valueTokens.length;
            expressionIndex++, valueIndex++
          ) {
            if (!eq(expressionTokens[expressionIndex], valueTokens[valueIndex])) {
              break;
            } else if (valueIndex === valueTokens.length - 1) {
              return true;
            }
          }
        }
        return false;
      });

      return foundUsage !== undefined;
    }
  }
});

function eq(token1: TSESTree.Token, token2: TSESTree.Token) {
  return token1.value === token2.value;
}

function isSimpleAssignment(node: TSESTree.Node): node is TSESTree.AssignmentExpression {
  return node.type === AST_NODE_TYPES.AssignmentExpression && node.operator === '=';
}

interface KeyWriteCollectionUsage {
  collectionNode: TSESTree.Node,
  indexOrKey: string,
  node: TSESTree.Node
}

function extractIndex(node: TSESTree.Node): string | undefined {
  if (node.type === AST_NODE_TYPES.Literal) {
    const { value } = node;
    return typeof value === 'number' || typeof value === 'string' ? String(value) : undefined;
  }
  if (node.type === AST_NODE_TYPES.Identifier) {
    return node.name;
  }
  return undefined;
}

function mapOrSetKeyWriteUsage(node: TSESTree.Node): KeyWriteCollectionUsage | undefined {
  if (
    node.type === AST_NODE_TYPES.CallExpression
    && node.callee.type === AST_NODE_TYPES.MemberExpression
  ) {
    const propertyAccess = node.callee;
    if (propertyAccess.property.type === AST_NODE_TYPES.Identifier) {
      const methodName = propertyAccess.property.name;
      const addMethod = methodName === 'add' && node.arguments.length === 1;
      const setMethod = methodName === 'set' && node.arguments.length === 2;

      if (addMethod || setMethod) {
        const key = extractIndex(node.arguments[0]);
        if (key) {
          return {
            collectionNode: propertyAccess.object,
            indexOrKey: key,
            node
          };
        }
      }
    }
  }
  return undefined;
}

function getProgramStatements(program: TSESTree.Program) {
  return program.body.filter((node): node is TSESTree.Statement => !isModuleDeclaration(node));
}

function isModuleDeclaration(
  node: TSESTree.Node | undefined
) {
  if (!node) {
    return false;
  }
  return node.type === AST_NODE_TYPES.ImportDeclaration
    || node.type === AST_NODE_TYPES.ExportNamedDeclaration
    || node.type === AST_NODE_TYPES.ExportDefaultDeclaration
    || node.type === AST_NODE_TYPES.ExportAllDeclaration;
}
