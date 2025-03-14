import { RegExpParser } from '@eslint-community/regexpp';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils, ESLintUtils } from '@typescript-eslint/utils';
import { getTypeName } from '@typescript-eslint/type-utils';

import { createRule, ensureParserWithTypeInformation } from '@eslint-sukka/shared';

const EQ_OPERATORS = /^[!=]=/;
const regexpp = new RegExpParser();

export default createRule({
  name: 'prefer-string-starts-ends-with',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce using `String#startsWith` and `String#endsWith` over other equivalent methods of checking substrings'
      // recommended: 'stylistic',
      // requiresTypeChecking: true
    },
    messages: {
      preferStartsWith: 'Use \'String#startsWith\' method instead.',
      preferEndsWith: 'Use the \'String#endsWith\' method instead.'
    },
    schema: [],
    fixable: 'code'
  },

  create(context) {
    ensureParserWithTypeInformation(context.sourceCode.parserServices);
    const services = context.sourceCode.parserServices;
    const program = services.program;
    const checker = program.getTypeChecker();

    const globalScope = context.sourceCode.scopeManager?.scopes[0];

    /**
     * Check if a given node is a string.
     * @param node The node to check.
     */
    function isStringType(node: TSESTree.Expression): boolean {
      const objectType = services.getTypeAtLocation(node);
      return getTypeName(checker, objectType) === 'string';
    }

    /**
     * Check if a given node is a `Literal` node that is null.
     * @param node The node to check.
     */
    function isNull(node: TSESTree.Node): node is TSESTree.Literal {
      const evaluated = ASTUtils.getStaticValue(node, globalScope);
      return evaluated != null && evaluated.value == null;
    }

    /**
     * Check if a given node is a `Literal` node that is a given value.
     * @param node The node to check.
     * @param value The expected value of the `Literal` node.
     */
    function isNumber(
      node: TSESTree.Node,
      value: number
    ): node is TSESTree.Literal {
      const evaluated = ASTUtils.getStaticValue(node, globalScope);
      return evaluated != null && evaluated.value === value;
    }

    /**
     * Check if a given node is a `Literal` node that is a character.
     * @param node The node to check.
     * @param kind The method name to get a character.
     */
    function isCharacter(node: TSESTree.Node): node is TSESTree.Literal {
      const evaluated = ASTUtils.getStaticValue(node, globalScope);
      return (
        evaluated != null
        && typeof evaluated.value === 'string'
        // checks if the string is a character long
        // eslint-disable-next-line sukka/string/prefer-string-starts-ends-with -- this is a special check for a single character
        && evaluated.value[0] === evaluated.value
      );
    }

    /**
     * Check if a given node is a `Literal` node that is a character.
     * @param node The node to check.
     * @param kind The method name to get a character.
     */
    function isASCIICharacter(node: TSESTree.Node): node is TSESTree.Literal {
      if (!isCharacter(node)) {
        return false;
      }
      const evaluated = ASTUtils.getStaticValue(node, globalScope);
      return (
        evaluated != null
        && typeof evaluated.value === 'string'
        // checks if the string is a character long
        // eslint-disable-next-line sukka/string/prefer-string-starts-ends-with -- this is a special check for a single character
        && evaluated.value[0] === evaluated.value
        // checks if the character is ASCII
        && isASCII(evaluated.value)
      );
    }

    /**
     * Check if two given nodes are the same meaning.
     * @param node1 A node to compare.
     * @param node2 Another node to compare.
     */
    function isSameTokens(node1: TSESTree.Node, node2: TSESTree.Node): boolean {
      const tokens1 = context.sourceCode.getTokens(node1);
      const tokens2 = context.sourceCode.getTokens(node2);

      if (tokens1.length !== tokens2.length) {
        return false;
      }

      for (let i = 0, len = tokens1.length; i < len; ++i) {
        const token1 = tokens1[i];
        const token2 = tokens2[i];

        if (token1.type !== token2.type || token1.value !== token2.value) {
          return false;
        }
      }

      return true;
    }

    /**
     * Check if a given node is the expression of the length of a string.
     *
     * - If `length` property access of `expectedObjectNode`, it's `true`.
     *   E.g., `foo` → `foo.length` / `"foo"` → `"foo".length`
     * - If `expectedObjectNode` is a string literal, `node` can be a number.
     *   E.g., `"foo"` → `3`
     *
     * @param node The node to check.
     * @param expectedObjectNode The node which is expected as the receiver of `length` property.
     */
    function isLengthExpression(
      node: TSESTree.Node,
      expectedObjectNode: TSESTree.Node
    ): boolean {
      if (node.type === AST_NODE_TYPES.MemberExpression) {
        return (
          ASTUtils.getPropertyName(node, globalScope) === 'length'
          && isSameTokens(node.object, expectedObjectNode)
        );
      }

      const evaluatedLength = ASTUtils.getStaticValue(node, globalScope);
      const evaluatedString = ASTUtils.getStaticValue(expectedObjectNode, globalScope);
      return (
        evaluatedLength != null
        && evaluatedString != null
        && typeof evaluatedLength.value === 'number'
        && typeof evaluatedString.value === 'string'
        && evaluatedLength.value === evaluatedString.value.length
      );
    }

    /**
     * Returns true if `node` is `-substring.length` or
     * `parentString.length - substring.length`
     */
    function isLengthAheadOfEnd(
      node: TSESTree.Node,
      substring: TSESTree.Node,
      parentString: TSESTree.Node
    ): boolean {
      return (
        (
          node.type === AST_NODE_TYPES.UnaryExpression
          && node.operator === '-'
          && isLengthExpression(node.argument, substring)
        ) || (
          node.type === AST_NODE_TYPES.BinaryExpression
          && node.operator === '-'
          && isLengthExpression(node.left, parentString)
          && isLengthExpression(node.right, substring)
        )
      );
    }

    /**
     * Check if a given node is the expression of the last index.
     *
     * E.g. `foo.length - 1`
     *
     * @param node The node to check.
     * @param expectedObjectNode The node which is expected as the receiver of `length` property.
     */
    function isLastIndexExpression(
      node: TSESTree.Node,
      expectedObjectNode: TSESTree.Node
    ): boolean {
      return (
        node.type === AST_NODE_TYPES.BinaryExpression
        && node.operator === '-'
        && isLengthExpression(node.left, expectedObjectNode)
        && isNumber(node.right, 1)
      );
    }

    /**
     * Get the range of the property of a given `MemberExpression` node.
     *
     * - `obj[foo]` → the range of `[foo]`
     * - `obf.foo` → the range of `.foo`
     * - `(obj).foo` → the range of `.foo`
     *
     * @param node The member expression node to get.
     */
    function getPropertyRange(
      node: TSESTree.MemberExpression
    ): [number, number] {
      const dotOrOpenBracket = context.sourceCode.getTokenAfter(
        node.object,
        ASTUtils.isNotClosingParenToken
      )!;
      return [dotOrOpenBracket.range[0], node.range[1]];
    }

    /**
     * Parse a given node if it's a `RegExp` instance.
     * @param node The node to parse.
     */
    function parseRegExp(
      node: TSESTree.Node
    ): { isStartsWith: boolean, isEndsWith: boolean, text: string } | null {
      const evaluated = ASTUtils.getStaticValue(node, globalScope);
      if (evaluated == null || !(evaluated.value instanceof RegExp)) {
        return null;
      }

      const { source, flags } = evaluated.value;
      const isStartsWith = source.startsWith('^');
      const isEndsWith = source.endsWith('$');
      if (
        isStartsWith === isEndsWith
        || flags.includes('i')
        || flags.includes('m')
      ) {
        return null;
      }

      const text = parseRegExpText(source, flags.includes('u'));
      if (text == null) {
        return null;
      }

      return { isEndsWith, isStartsWith, text };
    }

    /**
     * Fix code with using the right operand as the search string.
     * For example: `foo.slice(0, 3) === 'bar'` → `foo.startsWith('bar')`
     * @param fixer The rule fixer.
     * @param node The node which was reported.
     * @param kind The kind of the report.
     * @param isNegative The flag to fix to negative condition.
     */
    function *fixWithRightOperand(
      fixer: TSESLint.RuleFixer,
      node: TSESTree.BinaryExpression,
      kind: 'end' | 'start',
      isNegative: boolean,
      isOptional: boolean
    ): IterableIterator<TSESLint.RuleFix> {
      // left is CallExpression or MemberExpression.
      const leftNode = getLeftNode(node.left);
      const propertyRange = getPropertyRange(leftNode);

      if (isNegative) {
        yield fixer.insertTextBefore(node, '!');
      }
      yield fixer.replaceTextRange(
        [propertyRange[0], node.right.range[0]],
        `${isOptional ? '?.' : '.'}${kind}sWith(`
      );
      yield fixer.replaceTextRange([node.right.range[1], node.range[1]], ')');
    }

    /**
     * Fix code with using the first argument as the search string.
     * For example: `foo.indexOf('bar') === 0` → `foo.startsWith('bar')`
     * @param fixer The rule fixer.
     * @param node The node which was reported.
     * @param kind The kind of the report.
     * @param negative The flag to fix to negative condition.
     */
    function *fixWithArgument(
      fixer: TSESLint.RuleFixer,
      node: TSESTree.BinaryExpression,
      callNode: TSESTree.CallExpression,
      calleeNode: TSESTree.MemberExpression,
      kind: 'end' | 'start',
      negative: boolean,
      isOptional: boolean
    ): IterableIterator<TSESLint.RuleFix> {
      if (negative) {
        yield fixer.insertTextBefore(node, '!');
      }
      yield fixer.replaceTextRange(
        getPropertyRange(calleeNode),
        `${isOptional ? '?.' : '.'}${kind}sWith`
      );
      yield fixer.removeRange([callNode.range[1], node.range[1]]);
    }

    return {
      // foo[0] === "a"
      // foo.charAt(0) === "a"
      // foo[foo.length - 1] === "a"
      // foo.charAt(foo.length - 1) === "a"
      [[
        'BinaryExpression > MemberExpression.left[computed=true]',
        'BinaryExpression > CallExpression.left > MemberExpression.callee[property.name="charAt"][computed=false]',
        'BinaryExpression > ChainExpression.left > MemberExpression[computed=true]',
        'BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name="charAt"][computed=false]'
      ].join(', ')](node: TSESTree.MemberExpression): void {
        let parentNode = getParent(node);

        const isUsingCharAt = parentNode.type === AST_NODE_TYPES.CallExpression;

        let indexNode: TSESTree.Node | null = null;
        if (parentNode.type === AST_NODE_TYPES.CallExpression) {
          if (parentNode.arguments.length === 1) {
            indexNode = parentNode.arguments[0];
          }
          parentNode = getParent(parentNode);
        } else {
          indexNode = node.property;
        }

        if (
          indexNode == null
          || !isEqualityComparison(parentNode)
          || !isStringType(node.object)
        ) {
          return;
        }

        const isEndsWith = isLastIndexExpression(indexNode, node.object);
        const isStartsWith = !isEndsWith && isNumber(indexNode, 0);
        if (!isStartsWith && !isEndsWith) {
          return;
        }

        const eqNode = parentNode;

        if (isStartsWith && !isUsingCharAt && isASCIICharacter(eqNode.right)) {
          // We can identify the type of the right value
          // we skip if the right value is an ascii value (simple, faster case)
          return;
        }

        context.report({
          node: parentNode,
          messageId: isStartsWith ? 'preferStartsWith' : 'preferEndsWith',
          fix(fixer) {
            // Don't fix if it can change the behavior.
            if (!isCharacter(eqNode.right)) {
              return null;
            }
            return fixWithRightOperand(
              fixer,
              eqNode,
              isStartsWith ? 'start' : 'end',
              eqNode.operator.startsWith('!'),
              node.optional
            );
          }
        });
      },

      // foo.indexOf('bar') === 0
      [[
        'BinaryExpression > CallExpression.left > MemberExpression.callee[property.name="indexOf"][computed=false]',
        'BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name="indexOf"][computed=false]'
      ].join(', ')](node: TSESTree.MemberExpression): void {
        const callNode = getParent(node) as TSESTree.CallExpression;
        const parentNode = getParent(callNode);

        if (
          callNode.arguments.length !== 1
          || !isEqualityComparison(parentNode)
          || !isNumber(parentNode.right, 0)
          || !isStringType(node.object)
        ) {
          return;
        }

        context.report({
          node: parentNode,
          messageId: 'preferStartsWith',
          fix(fixer) {
            return fixWithArgument(
              fixer,
              parentNode,
              callNode,
              node,
              'start',
              parentNode.operator.startsWith('!'),
              node.optional
            );
          }
        });
      },

      // foo.lastIndexOf('bar') === foo.length - 3
      // foo.lastIndexOf(bar) === foo.length - bar.length
      [[
        'BinaryExpression > CallExpression.left > MemberExpression.callee[property.name="lastIndexOf"][computed=false]',
        'BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name="lastIndexOf"][computed=false]'
      ].join(', ')](node: TSESTree.MemberExpression): void {
        const callNode = getParent(node) as TSESTree.CallExpression;
        const parentNode = getParent(callNode);

        if (
          callNode.arguments.length !== 1
          || !isEqualityComparison(parentNode)
          || parentNode.right.type !== AST_NODE_TYPES.BinaryExpression
          || parentNode.right.operator !== '-'
          || !isLengthExpression(parentNode.right.left, node.object)
          || !isLengthExpression(parentNode.right.right, callNode.arguments[0])
          || !isStringType(node.object)
        ) {
          return;
        }

        context.report({
          node: parentNode,
          messageId: 'preferEndsWith',
          fix(fixer) {
            return fixWithArgument(
              fixer,
              parentNode,
              callNode,
              node,
              'end',
              parentNode.operator.startsWith('!'),
              node.optional
            );
          }
        });
      },

      // foo.match(/^bar/) === null
      // foo.match(/bar$/) === null
      [[
        'BinaryExpression > CallExpression.left > MemberExpression.callee[property.name="match"][computed=false]',
        'BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name="match"][computed=false]'
      ].join(', ')](node: TSESTree.MemberExpression): void {
        const callNode = getParent(node) as TSESTree.CallExpression;
        const parentNode = getParent(callNode) as TSESTree.BinaryExpression;

        if (
          !isEqualityComparison(parentNode)
          || !isNull(parentNode.right)
          || !isStringType(node.object)
        ) {
          return;
        }

        const parsed
          = callNode.arguments.length === 1
            ? parseRegExp(callNode.arguments[0])
            : null;
        if (parsed == null) {
          return;
        }

        const { isStartsWith, text } = parsed;
        context.report({
          node: callNode,
          messageId: isStartsWith ? 'preferStartsWith' : 'preferEndsWith',
          *fix(fixer) {
            if (!parentNode.operator.startsWith('!')) {
              yield fixer.insertTextBefore(parentNode, '!');
            }
            yield fixer.replaceTextRange(
              getPropertyRange(node),
              `${node.optional ? '?.' : '.'}${isStartsWith ? 'start' : 'end'
              }sWith`
            );
            yield fixer.replaceText(
              callNode.arguments[0],
              JSON.stringify(text)
            );
            yield fixer.removeRange([callNode.range[1], parentNode.range[1]]);
          }
        });
      },

      // foo.slice(0, 3) === 'bar'
      // foo.slice(-3) === 'bar'
      // foo.slice(-3, foo.length) === 'bar'
      // foo.substring(0, 3) === 'bar'
      // foo.substring(foo.length - 3) === 'bar'
      // foo.substring(foo.length - 3, foo.length) === 'bar'
      [[
        'BinaryExpression > CallExpression.left > MemberExpression.callee[property.name="slice"][computed=false]',
        'BinaryExpression > CallExpression.left > MemberExpression.callee[property.name="substring"][computed=false]',
        'BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name="slice"][computed=false]',
        'BinaryExpression > ChainExpression.left > CallExpression > MemberExpression.callee[property.name="substring"][computed=false]'
      ].join(', ')](node: TSESTree.MemberExpression): void {
        const callNode = getParent(node) as TSESTree.CallExpression;
        const parentNode = getParent(callNode);

        if (!isEqualityComparison(parentNode) || !isStringType(node.object)) {
          return;
        }

        let isEndsWith = false;
        let isStartsWith = false;
        if (callNode.arguments.length === 1) {
          if (
            // foo.slice(-bar.length) === bar
            // foo.slice(foo.length - bar.length) === bar
            isLengthAheadOfEnd(
              callNode.arguments[0],
              parentNode.right,
              node.object
            )
          ) {
            isEndsWith = true;
          }
        } else if (callNode.arguments.length === 2) {
          if (
            // foo.slice(0, bar.length) === bar
            isNumber(callNode.arguments[0], 0)
            && isLengthExpression(callNode.arguments[1], parentNode.right)
          ) {
            isStartsWith = true;
          } else if (
            // foo.slice(foo.length - bar.length, foo.length) === bar
            // foo.slice(foo.length - bar.length, 0) === bar
            // foo.slice(-bar.length, foo.length) === bar
            // foo.slice(-bar.length, 0) === bar
            (
              isLengthExpression(callNode.arguments[1], node.object)
              || isNumber(callNode.arguments[1], 0)
            ) && isLengthAheadOfEnd(
              callNode.arguments[0],
              parentNode.right,
              node.object
            )
          ) {
            isEndsWith = true;
          }
        }

        if (!isStartsWith && !isEndsWith) {
          return;
        }

        const eqNode = parentNode;
        const negativeIndexSupported
          = (node.property as TSESTree.Identifier).name === 'slice';
        context.report({
          node: parentNode,
          messageId: isStartsWith ? 'preferStartsWith' : 'preferEndsWith',
          fix(fixer) {
            // Don't fix if it can change the behavior.
            if (
              eqNode.operator.length === 2
              && (
                eqNode.right.type !== AST_NODE_TYPES.Literal
                || typeof eqNode.right.value !== 'string'
              )
            ) {
              return null;
            }
            // code being checked is likely mistake:
            // unequal length of strings being checked for equality
            // or reliant on behavior of substring (negative indices interpreted as 0)
            if (isStartsWith) {
              if (!isLengthExpression(callNode.arguments[1], eqNode.right)) {
                return null;
              }
            } else {
              const posNode = callNode.arguments[0];
              const posNodeIsAbsolutelyValid
                = (
                  posNode.type === AST_NODE_TYPES.BinaryExpression
                  && posNode.operator === '-'
                  && isLengthExpression(posNode.left, node.object)
                  && isLengthExpression(posNode.right, eqNode.right)
                )
                || (
                  negativeIndexSupported
                  && posNode.type === AST_NODE_TYPES.UnaryExpression
                  && posNode.operator === '-'
                  && isLengthExpression(posNode.argument, eqNode.right)
                );
              if (!posNodeIsAbsolutelyValid) {
                return null;
              }
            }

            return fixWithRightOperand(
              fixer,
              parentNode,
              isStartsWith ? 'start' : 'end',
              parentNode.operator.startsWith('!'),
              node.optional
            );
          }
        });
      },

      // /^bar/.test(foo)
      // /bar$/.test(foo)
      'CallExpression > MemberExpression.callee[property.name="test"][computed=false]': function (
        node: TSESTree.MemberExpression
      ): void {
        const callNode = getParent(node) as TSESTree.CallExpression;
        const parsed
          = callNode.arguments.length === 1 ? parseRegExp(node.object) : null;
        if (parsed == null) {
          return;
        }

        const { isStartsWith, text } = parsed;
        const messageId = isStartsWith ? 'preferStartsWith' : 'preferEndsWith';
        const methodName = isStartsWith ? 'startsWith' : 'endsWith';
        context.report({
          node: callNode,
          messageId,
          *fix(fixer) {
            const argNode = callNode.arguments[0];
            const needsParen
              = argNode.type !== AST_NODE_TYPES.Literal
                && argNode.type !== AST_NODE_TYPES.TemplateLiteral
                && argNode.type !== AST_NODE_TYPES.Identifier
                && argNode.type !== AST_NODE_TYPES.MemberExpression
                && argNode.type !== AST_NODE_TYPES.CallExpression;

            yield fixer.removeRange([callNode.range[0], argNode.range[0]]);
            if (needsParen) {
              yield fixer.insertTextBefore(argNode, '(');
              yield fixer.insertTextAfter(argNode, ')');
            }
            yield fixer.insertTextAfter(
              argNode,
              `${node.optional ? '?.' : '.'}${methodName}(${JSON.stringify(
                text
              )}`
            );
          }
        });
      }
    };
  }
});

/**
     * Parse a given `RegExp` pattern to that string if it's a static string.
     * @param pattern The RegExp pattern text to parse.
     * @param unicode Whether the RegExp is unicode.
     */
function parseRegExpText(pattern: string, unicode: boolean): string | null {
  // Parse it.
  const ast = regexpp.parsePattern(pattern, undefined, undefined, {
    unicode
  });
  if (ast.alternatives.length !== 1) {
    return null;
  }

  // Drop `^`/`$` assertion.
  const chars = ast.alternatives[0].elements;
  const first = chars[0];
  if (first.type === 'Assertion' && first.kind === 'start') {
    chars.shift();
  } else {
    chars.pop();
  }

  // Check if it can determine a unique string.
  if (!chars.every(c => c.type === 'Character')) {
    return null;
  }

  // To string.
  return String.fromCodePoint(
    ...chars.map(c => c.value)
  );
}

function getLeftNode(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier
): TSESTree.MemberExpression {
  if (node.type === AST_NODE_TYPES.ChainExpression) {
    return getLeftNode(node.expression);
  }

  let leftNode;
  if (node.type === AST_NODE_TYPES.CallExpression) {
    leftNode = node.callee;
  } else {
    leftNode = node;
  }

  if (leftNode.type !== AST_NODE_TYPES.MemberExpression) {
    throw new Error(`Expected a MemberExpression, got ${leftNode.type}`);
  }

  return leftNode;
}

function getParent(node: TSESTree.Node): TSESTree.Node {
  return ESLintUtils.nullThrows(
    node.parent?.type === AST_NODE_TYPES.ChainExpression
      ? node.parent.parent
      : node.parent,
    ESLintUtils.NullThrowsReasons.MissingParent
  );
}

/**
 * Check if a given node is `==`, `===`, `!=`, or `!==`.
 * @param node The node to check.
 */
function isEqualityComparison(
  node: TSESTree.Node
): node is TSESTree.BinaryExpression {
  return (
    node.type === AST_NODE_TYPES.BinaryExpression
    && EQ_OPERATORS.test(node.operator)
  );
}

function isASCII(str: string): boolean {
  const code = str.codePointAt(0);
  if (code == null) return false;
  return code >= 0x00 && code <= 0x7F;
}
