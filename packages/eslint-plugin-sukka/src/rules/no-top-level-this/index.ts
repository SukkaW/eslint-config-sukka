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
// https://sonarsource.github.io/rspec/#/rspec/S2990/javascript

import { createRule } from '@eslint-sukka/shared';
import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'removeThis' | 'suggestRemoveThis' | 'suggestUseGlobalThis';

export default createRule({
  name: 'no-top-level-this',
  meta: {
    hasSuggestions: true,
    schema: [],
    messages: {
      removeThis: 'Remove the use of "this".',
      suggestRemoveThis: 'Remove "this"',
      suggestUseGlobalThis: 'Replace "this" with "globalThis" object'
    },
    type: 'suggestion',
    docs: {
      description: 'The global "this" object should not be used',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S2990/javascript'
    },
    fixable: 'code'
  },
  create(context) {
    return {
      'MemberExpression[object.type="ThisExpression"]': (memberExpression: TSESTree.MemberExpression) => {
        const scopeType = context.sourceCode.getScope(memberExpression).variableScope.type;
        const isInsideClass = context.sourceCode
          .getAncestors(memberExpression)
          .some(
            ancestor => ancestor.type === AST_NODE_TYPES.ClassDeclaration || ancestor.type === AST_NODE_TYPES.ClassExpression
          );
        if ((scopeType === TSESLint.Scope.ScopeType.global || scopeType === TSESLint.Scope.ScopeType.module) && !isInsideClass) {
          const suggest: Array<TSESLint.SuggestionReportDescriptor<MessageIds>> = [];
          if (!memberExpression.computed) {
            const propertyText = context.sourceCode.getText(memberExpression.property);
            suggest.push(
              {
                messageId: 'suggestRemoveThis',
                fix: fixer => fixer.replaceText(memberExpression, propertyText)
              },
              {
                messageId: 'suggestUseGlobalThis',
                fix: fixer => fixer.replaceText(memberExpression.object, 'globalThis')
              }
            );
          }
          context.report({
            messageId: 'removeThis',
            node: memberExpression.object,
            suggest
          });
        }
      }
    };
  }
});
