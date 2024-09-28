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
// https://sonarsource.github.io/rspec/#/rspec/S3972

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createRule } from '@eslint-sukka/shared';

interface SiblingIfStatement {
  first: TSESTree.IfStatement,
  following: TSESTree.IfStatement
}

export default createRule({
  name: 'no-same-line-conditional',
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description: 'Conditionals should start on new lines',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S3972/javascript'
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      sameLineCondition: 'Move this "if" to a new line or add the missing "else".',
      suggestAddingElse: 'Add "else" keyword',
      suggestAddingNewline: 'Move this "if" to a new line'
    }
  },
  create(context) {
    function checkStatements(statements: TSESTree.Node[]) {
      const { sourceCode } = context;
      const siblingIfStatements = getSiblingIfStatements(statements);

      siblingIfStatements.forEach(siblingIfStatement => {
        const precedingIf = siblingIfStatement.first;
        const followingIf = siblingIfStatement.following;
        if (
          precedingIf.loc && followingIf.loc
          && precedingIf.loc.end.line === followingIf.loc.start.line
          && precedingIf.loc.start.line !== followingIf.loc.end.line
        ) {
          // const precedingIfLastToken = sourceCode.getLastToken(
          //   precedingIf as TSESTree.Node
          // ) as TSESLint.AST.Token;
          const followingIfToken = sourceCode.getFirstToken(
            followingIf as TSESTree.Node
          ) as TSESLint.AST.Token;

          context.report({
            messageId: 'sameLineCondition',
            loc: followingIfToken.loc,
            suggest: [
              // {
              //   messageId: 'suggestAddingElse',
              //   fix: fixer => fixer.insertTextBefore(followingIfToken, 'else ')
              // },
              {
                messageId: 'suggestAddingNewline',
                fix: fixer => fixer.replaceTextRange(
                  [precedingIf.range[1], followingIf.range[0]],
                  '\n' + ' '.repeat(precedingIf.loc.start.column)
                )
              }
            ]
          });
        }
      });
    }

    return {
      Program: (node: TSESTree.Program) => checkStatements(node.body),
      BlockStatement: (node: TSESTree.BlockStatement) => checkStatements(node.body),
      SwitchCase: (node: TSESTree.SwitchCase) => checkStatements(node.consequent)
    };
  }
});

function getSiblingIfStatements(statements: TSESTree.Node[]): SiblingIfStatement[] {
  return statements.reduce<SiblingIfStatement[]>((siblingsArray, statement, currentIndex) => {
    const previousStatement = statements[currentIndex - 1] as TSESTree.Node | undefined;
    if (
      statement.type === AST_NODE_TYPES.IfStatement
      && !!previousStatement
      && previousStatement.type === AST_NODE_TYPES.IfStatement
    ) {
      return [{ first: previousStatement, following: statement }, ...siblingsArray];
    }
    return siblingsArray;
  }, []);
}
