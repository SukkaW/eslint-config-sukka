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
// https://sonarsource.github.io/rspec/#/rspec/S4139/javascript

import { createRule, ensureParserWithTypeInformation } from '@eslint-sukka/shared';
import type ts from 'typescript';
import type { ParserServicesWithTypeInformation, TSESTree } from '@typescript-eslint/utils';

export default createRule({
  name: 'no-for-in-iterable',
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description: '"for in" should not be used with iterables',
      recommended: 'strict',
      url: 'https://sonarsource.github.io/rspec/#/rspec/S4139/javascript'
    },
    messages: {
      useForOf: 'Use "for...of" to iterate over this "{{iterable}}".'
    }
  },
  create(context) {
    const services = context.sourceCode.parserServices;
    const isIterable = (type: ts.Type) => {
      ensureParserWithTypeInformation(services);
      return isCollection(type) || isStringType(type) || isArrayLikeType(type, services);
    };

    return {
      ForInStatement(node) {
        ensureParserWithTypeInformation(services);
        const type = getTypeFromTreeNode(node.right, services);
        if (isIterable(type)) {
          const iterable = (type.symbol as ts.Symbol | undefined) ? type.symbol.name : 'String';
          context.report({
            messageId: 'useForOf',
            data: { iterable },
            loc: context.sourceCode.getFirstToken(node)!.loc
          });
        }
      }
    };
  }
});

export function isStringType(type: ts.Type) {
  return (type.flags & 402_653_316 /* ts.TypeFlags.StringLike */) > 0 || (type.symbol as ts.Symbol | undefined)?.name === 'String';
}

/**
 * This function checks if a type may correspond to an array type. Beyond simple array types, it will also
 * consider the union of array types and generic types extending an array type.
 * @param type A type to check
 * @param services The services used to get access to the TypeScript type checker
 */
export function isArrayLikeType(type: ts.Type, services: ParserServicesWithTypeInformation) {
  const checker = services.program.getTypeChecker();
  const constrained = checker.getBaseConstraintOfType(type);
  return isArrayOrUnionOfArrayType(constrained ?? type, services);
}

function isArrayOrUnionOfArrayType(type: ts.Type, services: ParserServicesWithTypeInformation): boolean {
  for (const part of getUnionTypes(type)) {
    if (!isArrayType(part, services)) {
      return false;
    }
  }

  return true;
}

// Internal TS API
function isArrayType(type: ts.Type, services: ParserServicesWithTypeInformation): type is ts.TypeReference {
  const checker = services.program.getTypeChecker();
  return (
    'isArrayType' in checker
    && typeof checker.isArrayType === 'function'
    && checker.isArrayType(type)
  );
}

/**
 * Returns an array of the union types if the provided type is a union.
 * Otherwise, returns an array containing the provided type as its unique element.
 * @param type A TypeScript type.
 * @return An array of types. It's never empty.
 */
export function getUnionTypes(type: ts.Type): ts.Type[] {
  return type.isUnion() ? type.types : [type];
}

function getTypeFromTreeNode(node: TSESTree.Expression, services: ParserServicesWithTypeInformation) {
  const checker = services.program.getTypeChecker();
  return checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}

const collectionTypes = new Set([
  'Array',
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
  'Set',
  'Map'
]);

function isCollection(type: ts.Type) {
  return (
    type.symbol
    && collectionTypes.has(type.symbol.name)
  );
}
