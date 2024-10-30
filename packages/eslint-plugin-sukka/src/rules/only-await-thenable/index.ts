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
// https://sonarsource.github.io/rspec/#/rspec/S4123/javascript

import type ts from 'typescript';
import { SyntaxKind as tsSyntaxKind, TypeFlags as tsTypeFlags } from 'typescript';
import { createRule, ensureParserWithTypeInformation } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { ParserServicesWithTypeInformation, TSESTree } from '@typescript-eslint/utils';
import { getTypeFromTreeNode } from '../no-for-in-iterable';

export default createRule({
  name: 'only-await-thenable',
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description: '"await" should only be used with promises',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S4123/javascript'
    },
    messages: {
      refactorAwait: 'Refactor this redundant \'await\' on a non-promise.'
    }
  },
  create(context) {
    const services = context.sourceCode.parserServices;
    ensureParserWithTypeInformation(services);
    return {
      AwaitExpression(node: TSESTree.AwaitExpression) {
        const awaitedType = getTypeFromTreeNode(node.argument, services);
        if (
          !isException(node, services)
          && !isThenable(awaitedType)
          && !isAny(awaitedType)
          && !isUnknown(awaitedType)
          && !isUnion(awaitedType)
        ) {
          context.report({
            messageId: 'refactorAwait',
            node
          });
        }
      }
    };
  }
});

/**
 * If the awaited expression is a call expression, check if it is a call to a function with
 * a JSDoc containing a return tag.
 */
function isException(node: TSESTree.AwaitExpression, services: ParserServicesWithTypeInformation) {
  if (node.argument.type !== AST_NODE_TYPES.CallExpression) {
    return false;
  }
  const signature = getSignatureFromCallee(node.argument, services);
  return signature?.declaration && hasJsDocReturn(signature.declaration);
}

function hasJsDocReturn(declaration: ts.Declaration & { jsDoc?: ts.JSDoc[] }) {
  const RETURN_TAGS = new Set(['return', 'returns']);
  if (!declaration.jsDoc) {
    return false;
  }
  for (const jsDoc of declaration.jsDoc) {
    if (jsDoc.tags?.some(tag => RETURN_TAGS.has(tag.tagName.escapedText.toString()))) {
      return true;
    }
  }
  return false;
}

export function getSignatureFromCallee(node: TSESTree.Node, services: ParserServicesWithTypeInformation) {
  const checker = services.program.getTypeChecker();
  return checker.getResolvedSignature(
    services.esTreeNodeToTSNodeMap.get(node) as ts.CallLikeExpression
  );
}

function isThenable(type: ts.Type) {
  const thenProperty = type.getProperty('then');
  return thenProperty?.declarations?.some(
    d => d.kind === tsSyntaxKind.MethodSignature
      || d.kind === tsSyntaxKind.MethodDeclaration
      || d.kind === tsSyntaxKind.PropertyDeclaration
  );
}

function isAny(type: ts.Type) {
  return Boolean(type.flags & tsTypeFlags.Any);
}

function isUnknown(type: ts.Type) {
  return Boolean(type.flags & tsTypeFlags.Unknown);
}

function isUnion(type: ts.Type) {
  return Boolean(type.flags & tsTypeFlags.Union);
}
