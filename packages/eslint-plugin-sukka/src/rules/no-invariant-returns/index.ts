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
// https://sonarsource.github.io/rspec/#/rspec/S3516/javascript

import { createRule } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { TSESTree } from '@typescript-eslint/types';
import { TSESLint } from '@typescript-eslint/utils';
import { findFirstMatchingAncestor, isReferenceTo } from '../no-empty-collection';
import { isFunctionLike } from '../class-prototype';

interface FunctionContext {
  codePath: TSESLint.CodePath,
  containsReturnWithoutValue: boolean,
  returnStatements: TSESTree.ReturnStatement[]
}

interface SingleWriteVariable {
  variable: TSESLint.Scope.Variable,
  initExpression?: TSESTree.Expression | null
}

type LiteralValue = number | RegExp | string | null | boolean | bigint;

export default createRule({
  name: 'no-invariant-returns',
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description: 'Function returns should not be invariant',
      recommended: 'recommended',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S3516/javascript',
      requiresTypeChecking: false
    },
    messages: {
      refactorReturn: 'Refactor this function to only return once or not always return the same value.'
    }
  },
  create(context) {
    const functionContextStack: FunctionContext[] = [];
    const codePathSegments: TSESLint.CodePathSegment[][] = [];
    let currentCodePathSegments: TSESLint.CodePathSegment[] = [];

    const checkOnFunctionExit = (node: TSESTree.Node) => checkInvariantReturnStatements(node, functionContextStack[functionContextStack.length - 1]);

    function checkInvariantReturnStatements(node: TSESTree.Node, functionContext?: FunctionContext) {
      if (!functionContext || hasDifferentReturnTypes(functionContext, currentCodePathSegments)) {
        return;
      }

      const returnedValues = functionContext.returnStatements.map(returnStatement => returnStatement.argument);
      if (areAllSameValue(returnedValues, context.sourceCode.getScope(node))) {
        context.report({
          messageId: 'refactorReturn',
          node
        });
      }
    }

    return {
      onCodePathStart(codePath: TSESLint.CodePath) {
        functionContextStack.push({
          codePath,
          containsReturnWithoutValue: false,
          returnStatements: []
        });
        codePathSegments.push(currentCodePathSegments);
        currentCodePathSegments = [];
      },
      onCodePathEnd() {
        functionContextStack.pop();
        currentCodePathSegments = codePathSegments.pop() || [];
      },
      onCodePathSegmentStart(segment: TSESLint.CodePathSegment) {
        currentCodePathSegments.push(segment);
      },
      onCodePathSegmentEnd() {
        currentCodePathSegments.pop();
      },
      ReturnStatement(node: TSESTree.Node) {
        if (functionContextStack.length) {
          const currentContext = functionContextStack[functionContextStack.length - 1];
          const returnStatement = node as TSESTree.ReturnStatement;
          currentContext.containsReturnWithoutValue = currentContext.containsReturnWithoutValue || !returnStatement.argument;
          currentContext.returnStatements.push(returnStatement);
        }
      },
      'FunctionDeclaration:exit': checkOnFunctionExit,
      'FunctionExpression:exit': checkOnFunctionExit,
      'ArrowFunctionExpression:exit': checkOnFunctionExit
    };
  }
});

function hasDifferentReturnTypes(
  functionContext: FunctionContext,
  currentSegments: TSESLint.CodePathSegment[]
) {
  // As this method is called at the exit point of a function definition, the current
  // segments are the ones leading to the exit point at the end of the function. If they
  // are reachable, it means there is an implicit return.
  const hasImplicitReturn = currentSegments.some(segment => segment.reachable);

  return (
    hasImplicitReturn
    || functionContext.containsReturnWithoutValue
    || functionContext.returnStatements.length <= 1
    || functionContext.codePath.thrownSegments.length > 0
  );
}

function areAllSameValue(returnedValues: Array<TSESTree.Node | null>, scope: TSESLint.Scope.Scope) {
  const firstReturnedValue = returnedValues[0];
  const firstValue = firstReturnedValue ? getLiteralValue(firstReturnedValue, scope) : undefined;
  if (firstValue !== undefined) {
    return returnedValues
      .slice(1)
      .every(returnedValue => getLiteralValue(returnedValue, scope) === firstValue);
  }
  if (firstReturnedValue?.type === AST_NODE_TYPES.Identifier) {
    const singleWriteVariable = getSingleWriteDefinition(firstReturnedValue.name, scope);
    if (singleWriteVariable) {
      const readReferenceIdentifiers = new Set(singleWriteVariable.variable.references
        .slice(1)
        .map(ref => ref.identifier));
      return returnedValues.every(returnedValue => readReferenceIdentifiers.has(returnedValue as TSESTree.Identifier));
    }
  }
  return false;
}

function getSingleWriteDefinition(
  variableName: string,
  scope: TSESLint.Scope.Scope
): SingleWriteVariable | null {
  const variable = scope.set.get(variableName);
  if (variable) {
    const references = variable.references.slice(1);
    if (!references.some(ref => ref.isWrite() || isPossibleObjectUpdate(ref))) {
      let initExpression = null;
      if (variable.defs.length === 1 && variable.defs[0].type === TSESLint.Scope.DefinitionType.Variable) {
        initExpression = variable.defs[0].node.init;
      }
      return { variable, initExpression };
    }
  }
  return null;
}

function isPossibleObjectUpdate(ref: TSESLint.Scope.Reference) {
  const expressionStatement = findFirstMatchingAncestor(
    ref.identifier as TSESTree.Node,
    n => n.type === AST_NODE_TYPES.ExpressionStatement || isFunctionLike(n)
  );

  // To avoid FP, we consider method calls as write operations, since we do not know whether they will
  // update the object state or not.
  return (
    expressionStatement
    && expressionStatement.type === AST_NODE_TYPES.ExpressionStatement
    && (isElementWrite(expressionStatement, ref)
      || expressionStatement.expression.type === AST_NODE_TYPES.CallExpression)
  );
}

/**
 * Detect expression statements like the following:
 *  myArray[1] = 42;
 *  myArray[1] += 42;
 *  myObj.prop1 = 3;
 *  myObj.prop1 += 3;
 */
export function isElementWrite(
  statement: TSESTree.ExpressionStatement,
  ref: TSESLint.Scope.Reference,
  recursive = true
): boolean {
  if (statement.expression.type === AST_NODE_TYPES.AssignmentExpression) {
    const assignmentExpression = statement.expression;
    const lhs = assignmentExpression.left;
    return isMemberExpressionReference(lhs, ref, recursive);
  }
  return false;
}

function isMemberExpressionReference(
  lhs: TSESTree.Node,
  ref: TSESLint.Scope.Reference,
  recursive = true
): boolean {
  return (
    lhs.type === AST_NODE_TYPES.MemberExpression
    && (isReferenceTo(ref, lhs.object)
      || (recursive && isMemberExpressionReference(lhs.object, ref, recursive)))
  );
}

function getLiteralValue(returnedValue: TSESTree.Node | null, scope: TSESLint.Scope.Scope): LiteralValue | undefined {
  if (!returnedValue) return;

  if (returnedValue.type === AST_NODE_TYPES.Literal) {
    return returnedValue.value;
  }
  if (returnedValue.type === AST_NODE_TYPES.UnaryExpression) {
    const innerReturnedValue = getLiteralValue(returnedValue.argument, scope);
    return innerReturnedValue === undefined
      ? undefined
      : evaluateUnaryLiteralExpression(returnedValue.operator, innerReturnedValue);
  }
  if (returnedValue.type === AST_NODE_TYPES.Identifier) {
    const singleWriteVariable = getSingleWriteDefinition(returnedValue.name, scope);
    if (singleWriteVariable?.initExpression) {
      return getLiteralValue(singleWriteVariable.initExpression, scope);
    }
  }
  return undefined;
}

function evaluateUnaryLiteralExpression(operator: string, innerReturnedValue: LiteralValue) {
  switch (operator) {
    case '-':
      return -Number(innerReturnedValue);
    case '+':
      return Number(innerReturnedValue);
    case '~':
      return ~Number(innerReturnedValue);
    case '!':
      return !innerReturnedValue;
    case 'typeof':
      return typeof innerReturnedValue;
    default:
  }
}
