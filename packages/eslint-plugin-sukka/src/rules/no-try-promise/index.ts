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
// https://sonarsource.github.io/rspec/#/rspec/S4822/javascript

import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { ParserServicesWithTypeInformation, TSESTree } from '@typescript-eslint/utils';
import { ensureParserWithTypeInformation, createRule } from '@eslint-sukka/shared';
import { CallLikeExpressionVisitor } from './utils';
import { SymbolFlags as tsSymbolFlags } from 'typescript';

type CallLikeExpression =
  | TSESTree.CallExpression
  | TSESTree.NewExpression
  | TSESTree.AwaitExpression;

export default createRule({
  name: 'no-try-promise',
  meta: {
    schema: [],
    type: 'problem',
    docs: {
      description: 'Promise rejections should not be caught by "try" blocks',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S4822/javascript',
      requiresTypeChecking: true
    },
    messages: {
      addAwait: 'Consider using \'await\' for the promise{{ending}} inside this \'try\' or replace it with \'Promise.prototype.catch(...)\' usage{{ending}}.',
      removeTry: 'Consider removing this \'try\' statement as promise{{ending}} rejection is already captured by \'.catch()\' method.'
    }
  },
  create(context) {
    const services = context.sourceCode.parserServices;
    ensureParserWithTypeInformation(services);

    function checkForUselessCatch(
      tryStmt: TSESTree.TryStatement,
      openPromises: TSESTree.Node[],
      capturedPromises: TSESTree.Node[]
    ) {
      if (openPromises.length === 0 && capturedPromises.length > 0) {
        const ending = capturedPromises.length > 1 ? 's' : '';
        const token = context.sourceCode.getFirstToken(tryStmt);
        context.report({
          messageId: 'removeTry',
          data: { ending },
          loc: token!.loc
        });
      }
    }

    function checkForWrongCatch(
      tryStmt: TSESTree.TryStatement,
      openPromises: TSESTree.Node[]
    ) {
      if (openPromises.length > 0) {
        const ending = openPromises.length > 1 ? 's' : '';
        const token = context.sourceCode.getFirstToken(tryStmt);
        context.report({
          messageId: 'addAwait',
          data: { ending },
          loc: token!.loc
        });
      }
    }

    return {
      TryStatement(tryStmt) {
        if (tryStmt.handler) {
          // without '.catch()'
          const openPromises: TSESTree.Node[] = [];
          // with '.catch()'
          const capturedPromises: TSESTree.Node[] = [];

          let hasPotentiallyThrowingCalls = false;
          CallLikeExpressionVisitor.getCallExpressions(tryStmt.block, context).forEach(callLikeExpr => {
            if (
              callLikeExpr.type === AST_NODE_TYPES.AwaitExpression
              || !isThenable(callLikeExpr, services)
            ) {
              hasPotentiallyThrowingCalls = true;
              return;
            }

            if (isAwaitLike(callLikeExpr) || isThened(callLikeExpr) || isCatch(callLikeExpr)) {
              return;
            }

            (isCaught(callLikeExpr) ? capturedPromises : openPromises).push(callLikeExpr);
          });

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- fuck TS control flow analyze
          if (!hasPotentiallyThrowingCalls) {
            checkForWrongCatch(tryStmt, openPromises);
            checkForUselessCatch(tryStmt, openPromises, capturedPromises);
          }
        }
      }
    };
  }
});

function isThenable(node: TSESTree.Node, services: ParserServicesWithTypeInformation) {
  const mapped = services.esTreeNodeToTSNodeMap.get(node);
  const tp = services.program.getTypeChecker().getTypeAtLocation(mapped);
  const thenProperty = tp.getProperty('then');
  return Boolean(thenProperty && thenProperty.flags & tsSymbolFlags.Method);
}

function isAwaitLike(callExpr: CallLikeExpression) {
  return (
    callExpr.parent
    && (callExpr.parent.type === AST_NODE_TYPES.AwaitExpression || callExpr.parent.type === AST_NODE_TYPES.YieldExpression)
  );
}

function isThened(callExpr: CallLikeExpression) {
  return (
    callExpr.parent
    && callExpr.parent.type === AST_NODE_TYPES.MemberExpression
    && callExpr.parent.property.type === AST_NODE_TYPES.Identifier
    && callExpr.parent.property.name === 'then'
  );
}

function isCaught(callExpr: CallLikeExpression) {
  return (
    callExpr.parent
    && callExpr.parent.type === AST_NODE_TYPES.MemberExpression
    && callExpr.parent.property.type === AST_NODE_TYPES.Identifier
    && callExpr.parent.property.name === 'catch'
  );
}

function isCatch(callExpr: CallLikeExpression) {
  return (
    callExpr.type === AST_NODE_TYPES.CallExpression
    && callExpr.callee.type === AST_NODE_TYPES.MemberExpression
    && callExpr.callee.property.type === AST_NODE_TYPES.Identifier
    && callExpr.callee.property.name === 'catch'
  );
}
