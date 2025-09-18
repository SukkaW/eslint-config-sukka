/*
 * eslint-plugin-sonarjs
 * Copyright (C) 2018-2021 SonarSource SA
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
// https://sonarsource.github.io/rspec/#/rspec/S1126
import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { TSESTree } from '@typescript-eslint/types';
import type { TSESLint } from '@typescript-eslint/utils';
import { createRule } from '@eslint-sukka/shared';

export default createRule({
  name: 'prefer-single-boolean-return',
  meta: {
    messages: {
      replaceIfThenElseByReturn: 'Replace this if-then-else flow by a single return statement.',
      suggest: 'Replace with single return statement',
      suggestCast: 'Replace with single return statement using "!!" cast',
      suggestBoolean:
        'Replace with single return statement without cast (condition should be boolean!)'
    },
    schema: [],
    type: 'suggestion',
    hasSuggestions: true,
    docs: {
      description: 'Return of boolean expressions should not be wrapped into an "if-then-else" statement',
      recommended: 'recommended'
    }
  },
  create(context) {
    return {
      IfStatement(node: TSESTree.IfStatement) {
        if (
          // ignore `else if`
          node.parent.type !== AST_NODE_TYPES.IfStatement
          && returnsBoolean(node.consequent)
          && alternateReturnsBoolean(node)
        ) {
          context.report({
            messageId: 'replaceIfThenElseByReturn',
            node,
            suggest: getSuggestion(node)
          });
        }
      }
    };

    function getSuggestion(ifStmt: TSESTree.IfStatement) {
      const getFix = (condition: string) => (fixer: TSESLint.RuleFixer) => {
        const singleReturn = `return ${condition};`;
        if (ifStmt.alternate) {
          return fixer.replaceText(ifStmt, singleReturn);
        }
        const parent = ifStmt.parent as TSESTree.BlockStatement;
        const ifStmtIndex = parent.body.indexOf(ifStmt);
        const returnStmt = parent.body[ifStmtIndex + 1];
        const range: [number, number] = [ifStmt.range[0], returnStmt.range[1]];
        return fixer.replaceTextRange(range, singleReturn);
      };
      const shouldNegate = isReturningFalse(ifStmt.consequent);
      const shouldCast = !isBooleanExpression(ifStmt.test);
      const testText = context.sourceCode.getText(ifStmt.test);

      if (shouldNegate) {
        return [{ messageId: 'suggest', fix: getFix(`!(${testText})`) }] as const;
      }
      if (!shouldCast) {
        return [{ messageId: 'suggest', fix: getFix(testText) }] as const;
      }
      return [
        { messageId: 'suggestCast', fix: getFix(`!!(${testText})`) },
        { messageId: 'suggestBoolean', fix: getFix(testText) }
      ] as const;
    }
  }
});

function isSimpleReturnBooleanLiteral(statement: TSESTree.Node | undefined) {
  // `statement.argument` can be `null`, replace it with `undefined` in this case
  return statement?.type === AST_NODE_TYPES.ReturnStatement && statement.argument?.type === AST_NODE_TYPES.Literal && typeof statement.argument.value === 'boolean';
}

function isReturningFalse(stmt: TSESTree.Statement): boolean {
  const returnStmt = (
    stmt.type === AST_NODE_TYPES.BlockStatement ? stmt.body[0] : stmt
  ) as TSESTree.ReturnStatement;
  return (returnStmt.argument as TSESTree.Literal).value === false;
}

function isBooleanExpression(expr: TSESTree.Expression) {
  return (
    (expr.type === AST_NODE_TYPES.UnaryExpression || expr.type === AST_NODE_TYPES.BinaryExpression)
    && ['!', '==', '===', '!=', '!==', '<', '<=', '>', '>=', 'in', 'instanceof'].includes(
      expr.operator
    )
  );
}

function isBlockReturningBooleanLiteral(statement: TSESTree.Statement) {
  return (
    statement.type === AST_NODE_TYPES.BlockStatement
    && statement.body.length === 1
    && isSimpleReturnBooleanLiteral(statement.body[0])
  );
}

function returnsBoolean(statement: TSESTree.Statement | undefined) {
  return (
    statement !== undefined
    && (isBlockReturningBooleanLiteral(statement) || isSimpleReturnBooleanLiteral(statement))
  );
}

function alternateReturnsBoolean(node: TSESTree.IfStatement) {
  if (node.alternate) {
    return returnsBoolean(node.alternate);
  }

  const { parent } = node;
  if (parent.type === AST_NODE_TYPES.BlockStatement) {
    const ifStmtIndex = parent.body.indexOf(node);
    return isSimpleReturnBooleanLiteral(parent.body[ifStmtIndex + 1]);
  }

  return false;
}
