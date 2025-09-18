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
// https://sonarsource.github.io/rspec/#/rspec/S1301

import { createRule } from '@eslint-sukka/shared';
import type { TSESTree } from '@typescript-eslint/types';

export default createRule({
  name: 'no-small-switch',
  meta: {
    schema: [],
    messages: {
      replaceSwitch: 'Replace this "switch" statement by "if" statements to increase readability.'
    },
    type: 'suggestion',
    docs: {
      description: '"if" statements should be preferred over "switch" when simpler',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S1301/javascript'
    }
  },
  create(context) {
    return {
      SwitchStatement(node: TSESTree.SwitchStatement) {
        const { cases } = node;
        const hasDefault = cases.some(x => !x.test);
        if (cases.length < 2 || (cases.length === 2 && hasDefault)) {
          const firstToken = context.sourceCode.getFirstToken(node) as TSESTree.Token | null;
          if (firstToken) {
            context.report({
              messageId: 'replaceSwitch',
              loc: firstToken.loc
            });
          }
        }
      }
    };
  }
});
