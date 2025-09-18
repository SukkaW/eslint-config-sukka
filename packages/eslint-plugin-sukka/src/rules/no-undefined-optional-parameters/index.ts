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
// https://sonarsource.github.io/rspec/#/rspec/S4623/javascript

import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { TSESTree } from '@typescript-eslint/types';
import type { ParserServicesWithTypeInformation } from '@typescript-eslint/utils';
import type ts from 'typescript';
import { SyntaxKind as tsSyntaxKind } from 'typescript';
import { createRule, ensureParserWithTypeInformation } from '@eslint-sukka/shared';

export default createRule({
  name: 'no-undefined-optional-parameters',
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description: '"undefined" should not be passed as the value of optional parameters',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S4623/javascript',
      requiresTypeChecking: true
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      removeUndefined: 'Remove this redundant "undefined".',
      suggestRemoveUndefined: 'Remove this redundant argument'
    }
  },
  create(context) {
    const services = context.sourceCode.parserServices;
    ensureParserWithTypeInformation(services);

    return {
      CallExpression(call: TSESTree.CallExpression) {
        const { arguments: args } = call;
        if (args.length === 0) {
          return;
        }

        const lastArgument = args[args.length - 1];
        if (isUndefined(lastArgument) && isOptionalParameter(args.length - 1, call, services)) {
          context.report({
            messageId: 'removeUndefined',
            node: lastArgument,
            suggest: [
              {
                messageId: 'suggestRemoveUndefined',
                fix(fixer) {
                  // eslint-disable-next-line sukka/unicorn/consistent-destructuring -- not necessary
                  if (call.arguments.length === 1) {
                    // eslint-disable-next-line sukka/unicorn/consistent-destructuring -- not necessary
                    const openingParen = context.sourceCode.getTokenAfter(call.callee)! as TSESTree.Token;
                    const closingParen = context.sourceCode.getLastToken(call)! as TSESTree.Token;
                    const [, begin] = openingParen.range;
                    const [end] = closingParen.range;
                    return fixer.removeRange([begin, end]);
                  }
                  const [, begin] = args[args.length - 2].range;
                  const [, end] = lastArgument.range;
                  return fixer.removeRange([begin, end]);
                }
              }
            ]
          });
        }
      }
    };
  }
});

function isOptionalParameter(
  paramIndex: number,
  node: TSESTree.CallExpression,
  services: ParserServicesWithTypeInformation
) {
  const signature = services.program
    .getTypeChecker()
    .getResolvedSignature(
      services.esTreeNodeToTSNodeMap.get(node as TSESTree.Node) as ts.CallLikeExpression
    );
  if (signature) {
    const declaration = signature.declaration;
    if (declaration && isFunctionLikeDeclaration(declaration)) {
      const { parameters } = declaration;
      const parameter = parameters[paramIndex] as ts.ParameterDeclaration | undefined;
      return parameter && (parameter.initializer || parameter.questionToken);
    }
  }
  return false;
}

function isUndefined(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

const functionSyntaxKind = new Set([
  tsSyntaxKind.FunctionDeclaration,
  tsSyntaxKind.FunctionExpression,
  tsSyntaxKind.ArrowFunction,
  tsSyntaxKind.MethodDeclaration,
  tsSyntaxKind.Constructor,
  tsSyntaxKind.GetAccessor,
  tsSyntaxKind.SetAccessor
]);

function isFunctionLikeDeclaration(declaration: ts.Declaration): declaration is ts.FunctionLikeDeclarationBase {
  return functionSyntaxKind.has(declaration.kind);
}
