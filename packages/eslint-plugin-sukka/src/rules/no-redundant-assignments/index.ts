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
// https://sonarsource.github.io/rspec/#/rspec/S4165/javascript

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { TSESLint } from '@typescript-eslint/utils';
import { createRule } from '@eslint-sukka/shared';
import { peek, CodePathContext, ReachingDefinitions, isDefaultParameter, isCompoundAssignment, isSelfAssignement, reachingDefinitions, resolveAssignedValues, AssignmentContext } from './utils';
import type { AssignmentLike, Values } from './utils';

export default createRule({
  name: 'no-redundant-assignments',
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description: 'Assignments should not be redundant',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S4165/javascript'
    },
    messages: {
      reviewAssignment:
        'Review this redundant assignment: "{{symbol}}" already holds the assigned value along all execution paths.'
    }
  },
  create(context) {
    const codePathStack: CodePathContext[] = [];
    const reachingDefsMap = new Map<string, ReachingDefinitions>();
    // map from Variable to CodePath ids where variable is used
    const variableUsages = new Map<TSESLint.Scope.Variable, Set<string>>();
    const codePathSegments: TSESLint.CodePathSegment[][] = [];
    let currentCodePathSegments: TSESLint.CodePathSegment[] = [];

    return {
      ':matches(AssignmentExpression, VariableDeclarator[init])': (node: TSESTree.Node) => {
        pushAssignmentContext(node as AssignmentLike);
      },
      ':matches(AssignmentExpression, VariableDeclarator[init]):exit': () => {
        popAssignmentContext();
      },
      Identifier(node: TSESTree.Node) {
        if (isEnumConstant(node)) {
          return;
        }
        checkIdentifierUsage(node as TSESTree.Identifier);
      },
      'Program:exit': () => {
        reachingDefinitions(reachingDefsMap);
        reachingDefsMap.forEach(defs => {
          checkSegment(defs);
        });
        reachingDefsMap.clear();
        variableUsages.clear();
        while (codePathStack.length > 0) {
          codePathStack.pop();
        }
      },

      // CodePath events
      onCodePathSegmentStart(segment: TSESLint.CodePathSegment) {
        reachingDefsMap.set(segment.id, new ReachingDefinitions(segment));
        currentCodePathSegments.push(segment);
      },
      onCodePathStart(codePath) {
        pushContext(new CodePathContext(codePath));
        codePathSegments.push(currentCodePathSegments);
        currentCodePathSegments = [];
      },
      onCodePathEnd() {
        popContext();
        currentCodePathSegments = codePathSegments.pop() || [];
      },
      onCodePathSegmentEnd() {
        currentCodePathSegments.pop();
      }
    };

    function popAssignmentContext() {
      const assignment = peek(codePathStack).assignmentStack.pop()!;
      assignment.rhs.forEach(r => processReference(r));
      assignment.lhs.forEach(r => processReference(r));
    }

    function pushAssignmentContext(node: AssignmentLike) {
      peek(codePathStack).assignmentStack.push(new AssignmentContext(node));
    }

    function checkSegment(reachingDefs: ReachingDefinitions) {
      const assignedValuesMap = new Map<TSESLint.Scope.Variable, Values>(reachingDefs.in);
      reachingDefs.references.forEach(ref => {
        const variable = ref.resolved;
        if (!variable || !ref.isWrite() || !shouldReport(ref)) {
          return;
        }
        const lhsValues = assignedValuesMap.get(variable);
        const rhsValues = resolveAssignedValues(
          variable,
          ref.writeExpr,
          assignedValuesMap,
          ref.from
        );
        if (lhsValues?.type === 'AssignedValues' && lhsValues.size === 1) {
          const [lhsVal] = [...lhsValues];
          checkRedundantAssignement(ref, ref.writeExpr, lhsVal, rhsValues, variable.name);
        }
        assignedValuesMap.set(variable, rhsValues);
      });
    }

    function checkRedundantAssignement(
      { resolved: variable }: TSESLint.Scope.Reference,
      node: TSESTree.Node | null | undefined,
      lhsVal: string | TSESLint.Scope.Variable,
      rhsValues: Values,
      name: string
    ) {
      if (rhsValues.type === 'UnknownValue' || rhsValues.size !== 1) {
        return;
      }
      const [rhsVal] = [...rhsValues];
      if (!isWrittenOnlyOnce(variable!) && lhsVal === rhsVal) {
        context.report({
          node: node!,
          messageId: 'reviewAssignment',
          data: {
            symbol: name
          }
        });
      }
    }

    // to avoid raising on code like:
    // while (cond) {  let x = 42; }
    function isWrittenOnlyOnce(variable: TSESLint.Scope.Variable) {
      return variable.references.filter(ref => ref.isWrite()).length === 1;
    }

    function shouldReport(ref: TSESLint.Scope.Reference) {
      const variable = ref.resolved;
      return variable && shouldReportReference(ref) && !variableUsedOutsideOfCodePath(variable);
    }

    function shouldReportReference(ref: TSESLint.Scope.Reference) {
      const variable = ref.resolved;

      return (
        variable
        && !isDefaultParameter(ref)
        && !variable.name.startsWith('_')
        && !isCompoundAssignment(ref.writeExpr)
        && !isSelfAssignement(ref)
        && !variable.defs.some(
          def => def.type === TSESLint.Scope.DefinitionType.Parameter || (def.type === TSESLint.Scope.DefinitionType.Variable && !def.node.init)
        )
      );
    }

    function isEnumConstant(node: TSESTree.Node) {
      return (context.sourceCode.getAncestors(node)).some(
        n => n.type === AST_NODE_TYPES.TSEnumDeclaration
      );
    }

    function variableUsedOutsideOfCodePath(variable: TSESLint.Scope.Variable) {
      return variableUsages.get(variable)!.size > 1;
    }

    function checkIdentifierUsage(node: TSESTree.Identifier) {
      const { ref, variable } = resolveReference(node);
      if (ref) {
        processReference(ref);
      }
      if (variable) {
        updateVariableUsages(variable);
      }
    }

    function processReference(ref: TSESLint.Scope.Reference) {
      const assignmentStack = peek(codePathStack).assignmentStack;
      if (assignmentStack.length > 0) {
        const assignment = peek(assignmentStack);
        assignment.add(ref);
      } else {
        currentCodePathSegments.forEach(segment => {
          const reachingDefs = reachingDefsForSegment(segment);
          reachingDefs.add(ref);
        });
      }
    }

    function reachingDefsForSegment(segment: TSESLint.CodePathSegment) {
      let defs;
      if (reachingDefsMap.has(segment.id)) {
        defs = reachingDefsMap.get(segment.id)!;
      } else {
        defs = new ReachingDefinitions(segment);
        reachingDefsMap.set(segment.id, defs);
      }
      return defs;
    }

    function updateVariableUsages(variable: TSESLint.Scope.Variable) {
      const codePathId = peek(codePathStack).codePath.id;
      if (variableUsages.has(variable)) {
        variableUsages.get(variable)!.add(codePathId);
      } else {
        variableUsages.set(variable, new Set<string>([codePathId]));
      }
    }

    function pushContext(codePathContext: CodePathContext) {
      codePathStack.push(codePathContext);
    }

    function popContext() {
      codePathStack.pop();
    }

    function resolveReferenceRecursively(
      node: TSESTree.Identifier,
      scope: TSESLint.Scope.Scope | null
    ): { ref: TSESLint.Scope.Reference | null, variable: TSESLint.Scope.Variable | null } {
      if (scope === null) {
        return { ref: null, variable: null };
      }
      const ref = scope.references.find(r => r.identifier === node);
      if (ref) {
        return { ref, variable: ref.resolved };
      }
      // if it's not a reference, it can be just declaration without initializer
      const variable = scope.variables.find(v => v.defs.find(def => def.name === node));
      if (variable) {
        return { ref: null, variable };
      }
      // in theory we only need 1-level recursion, only for switch expression, which is likely a bug in eslint
      // generic recursion is used for safety & readability
      return resolveReferenceRecursively(node, scope.upper);
    }

    function resolveReference(node: TSESTree.Identifier) {
      return resolveReferenceRecursively(node, context.sourceCode.getScope(node));
    }
  }
});
