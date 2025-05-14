import { createRule } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

const ARRAY_HIGH_ORDER_FUNCTIONS = new Set([
  'map',
  'filter',
  'reduce',
  'reduceRight',
  'forEach'
]);

export default createRule({
  name: 'no-chain-array-higher-order-functions',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Prefer `.reduce` over chaining `.filter`, `.map` methods',
      recommended: 'recommended'
    },
    schema: [],
    messages: {
      detected: 'Detected the chaining of array methods: {{methods}}. Reaplce with `.reduce` to reduce array iterations and improve the performance.'
    }
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (isArrayHigherOrderFunction(node)) {
          const parent = node.parent as TSESTree.CallExpression;
          if (isArrayHigherOrderFunction(parent.parent)) {
            context.report({
              node: parent,
              messageId: 'detected',
              data: {
                methods: `arr.${(node.property as TSESTree.Identifier).name}().${(parent.parent.property as TSESTree.Identifier).name}()`
              }
            });
          }
        }
      }
    };
  }
});

function isArrayHigherOrderFunction(node: TSESTree.Node): node is TSESTree.MemberExpressionNonComputedName {
  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }
  if (node.computed) {
    return false;
  }
  if (node.property.type !== AST_NODE_TYPES.Identifier) {
    return false;
  }
  return ARRAY_HIGH_ORDER_FUNCTIONS.has(node.property.name) && node.parent.type === AST_NODE_TYPES.CallExpression;
}
