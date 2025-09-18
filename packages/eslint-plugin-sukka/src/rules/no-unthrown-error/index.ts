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
// https://sonarsource.github.io/rspec/#/rspec/S3984/javascript

import { createRule } from '@eslint-sukka/shared';
import type { TSESTree } from '@typescript-eslint/types';

export default createRule({
  name: 'no-unthrown-error',
  meta: {
    schema: [],
    type: 'problem',
    docs: {
      description: 'Errors should not be created without being thrown',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S3984/javascript',
      requiresTypeChecking: false
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      throwOrRemoveError: 'Throw this error or remove this useless statement.',
      suggestThrowError: 'Throw this error'
    }
  },
  create(context) {
    function looksLikeAnError(expression: TSESTree.Expression | TSESTree.Super): boolean {
      const text = context.sourceCode.getText(expression);
      return text.endsWith('Error') || text.endsWith('Exception');
    }

    function getParent(node: TSESTree.Node) {
      const ancestors = context.sourceCode.getAncestors(node);
      return ancestors.length > 0 ? ancestors[ancestors.length - 1] : undefined;
    }

    return {
      'ExpressionStatement > NewExpression': function (node: TSESTree.NewExpression) {
        const expression = node.callee;
        if (looksLikeAnError(expression)) {
          const parent = getParent(node);

          context.report({
            messageId: 'throwOrRemoveError',
            node,
            suggest: parent
              ? [
                {
                  messageId: 'suggestThrowError',
                  fix: fixer => fixer.insertTextBefore(parent, 'throw ')
                }
              ]
              : []
          });
        }
      }
    };
  }
});
