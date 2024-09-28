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
// https://sonarsource.github.io/rspec/#/rspec/S1134/javascript

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '@eslint-sukka/shared';

export default createRule({
  name: 'track-todo-fixme-comment',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Track uses of "FIXME" and "TODO" tags',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S1134/javascript'
    },
    schema: [],
    messages: {
      fixme: 'Take the required action to fix the issue indicated by this comment.',
      todo: 'Complete the task associated to this "TODO" comment.'
    }
  },
  create(context) {
    function reportPatternInComment(
      pattern: string,
      messageId: 'fixme' | 'todo'
    ) {
      const sourceCode = context.sourceCode;
      (sourceCode.getAllComments()).forEach(comment => {
        const rawText = comment.value.toLowerCase();

        if (rawText.includes(pattern)) {
          const lines = rawText.split(/\r\n?|\n/);

          for (let i = 0; i < lines.length; i++) {
            const index = lines[i].indexOf(pattern);
            if (index >= 0 && !isLetterAround(lines[i], index, pattern)) {
              context.report({
                messageId,
                loc: getPatternPosition(i, index, comment, pattern)
              });
            }
          }
        }
      });
    }

    return {
      'Program:exit': () => {
        reportPatternInComment('fixme', 'fixme');
        reportPatternInComment('todo', 'todo');
      }
    };
  }
});

const letterPattern = /\p{Letter}/u;

function isLetterAround(line: string, start: number, pattern: string) {
  const end = start + pattern.length;

  const pre = start > 0 && letterPattern.test(line.charAt(start - 1));
  const post = end <= line.length - 1 && letterPattern.test(line.charAt(end));

  return pre || post;
}

function getPatternPosition(
  lineIdx: number,
  index: number,
  comment: TSESTree.Comment,
  pattern: string
) {
  const line = comment.loc.start.line + lineIdx;
  const columnStart = lineIdx === 0 ? comment.loc.start.column + 2 : 0;
  const patternStart = columnStart + index;

  return {
    start: { line, column: patternStart },
    end: { line, column: patternStart + pattern.length }
  };
}
