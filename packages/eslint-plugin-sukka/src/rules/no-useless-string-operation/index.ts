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
// https://sonarsource.github.io/rspec/#/rspec/S1154/javascript

import * as ts from 'typescript';
import { createRule, ensureParserWithTypeInformation } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { getTypeFromTreeNode } from '../no-for-in-iterable';

export default createRule({
  name: 'no-useless-string-operation',
  meta: {
    schema: [],
    messages: {
      uselessStringOp:
        '{{symbol}} is an immutable object; you must either store or return the result of the operation.'
    },
    type: 'problem',
    docs: {
      description: 'Results of operations on strings should not be ignored',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S1154/javascript'
    }
  },
  create(context) {
    const services = context.sourceCode.parserServices;

    function isString(node: TSESTree.Node) {
      ensureParserWithTypeInformation(services);
      const type = getTypeFromTreeNode(node, services);
      return (type.flags & ts.TypeFlags.StringLike) !== 0;
    }

    function getVariable(node: TSESTree.Node) {
      let variable = context.sourceCode.getText(node);
      if (variable.length > 30) {
        variable = 'String';
      }
      return variable;
    }

    return {
      'ExpressionStatement > CallExpression[callee.type="MemberExpression"]': (
        node: TSESTree.Node
      ) => {
        const { object, property } = (node as TSESTree.CallExpression)
          .callee as TSESTree.MemberExpression;
        if (isString(object) && property.type === AST_NODE_TYPES.Identifier) {
          context.report({
            messageId: 'uselessStringOp',
            data: {
              symbol: getVariable(object)
            },
            node: property
          });
        }
      }
    };
  }
});
