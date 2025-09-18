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
// https://sonarsource.github.io/rspec/#/rspec/S3525/javascript

import { createRule, isParserWithTypeInformation, ensureParserWithTypeInformation } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { SymbolFlags as tsSymbolFlags } from 'typescript';
import type { TSESTree } from '@typescript-eslint/types';
import type { ParserServices } from '@typescript-eslint/utils';

export default createRule({
  name: 'class-prototype',
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description: 'Class methods should be used instead of "prototype" assignments',
      recommended: 'recommended'
    },
    messages: {
      declareClass:
        'Declare a "{{class}}" class and move this declaration of "{{declaration}}" into it.'
    }
  },
  create(context) {
    const services = context.sourceCode.parserServices;
    const isFunction = isParserWithTypeInformation(services) ? isFunctionType : isFunctionLike;
    return {
      AssignmentExpression({ left, right }) {
        if (left.type === AST_NODE_TYPES.MemberExpression && isFunction(right, services)) {
          const [member, prototype] = [left.object, left.property];
          if (member.type === AST_NODE_TYPES.MemberExpression && prototype.type === AST_NODE_TYPES.Identifier) {
            const [klass, property] = [member.object, member.property];
            if (
              klass.type === AST_NODE_TYPES.Identifier
              && property.type === AST_NODE_TYPES.Identifier
              && property.name === 'prototype'
            ) {
              context.report({
                messageId: 'declareClass',
                data: {
                  class: klass.name,
                  declaration: prototype.name
                },
                node: left
              });
            }
          }
        }
      }
    };
  }
});

function isFunctionType(node: TSESTree.Node, services: Partial<ParserServices> | undefined) {
  ensureParserWithTypeInformation(services);
  const type = services.program.getTypeChecker().getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));

  return !!type.symbol && (type.symbol.flags & tsSymbolFlags.Function) !== 0;
}

export const FUNCTION_TYPES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);

function isFunctionLike(node: TSESTree.Node, _services: Partial<ParserServices> | undefined) {
  return FUNCTION_TYPES.has(
    node.type
  );
}
