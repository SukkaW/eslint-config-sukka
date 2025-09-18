import { Linter } from 'eslint';
import { nullthrow } from 'foxts/guard';
import { createRule } from '@eslint-sukka/shared';

const baseRule = nullthrow(
  new Linter({ configType: 'eslintrc' }).getRules().get('no-return-await'),
  '[eslint-plugin-sukka] no-return-await rule is removed from ESLint!'
);

export default createRule({
  ...baseRule,
  meta: {
    docs: {
      ...baseRule.meta?.docs,
      // @ts-expect-error -- fuck @eslint/core types
      recommended: undefined
    },
    // also we put it above so it can be overriden
    ...baseRule.meta,
    deprecated: false
  }
});

// import { createRule } from '@eslint-sukka/shared';
// import type { TSESTree } from '@typescript-eslint/utils';
// import { ASTUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';

// export default createRule({
//   name: 'no-return-await',

//   meta: {
//     type: 'suggestion',

//     hasSuggestions: true,

//     docs: {
//       description: 'Disallows unnecessary `return await`'
//     },

//     fixable: undefined,

//     deprecated: false,

//     schema: [],

//     messages: {
//       removeAwait: 'Remove redundant `await`.',
//       redundantUseOfAwait: 'Redundant use of `await` on a return value.'
//     }
//   },

//   create(context) {
//     /**
//          * Reports a found unnecessary `await` expression.
//          * @param The node representing the `await` expression to report
//          */
//     function reportUnnecessaryAwait(node: TSESTree.Node) {
//       context.report({
//         node: context.sourceCode.getFirstToken(node)!,
//         loc: node.loc,
//         messageId: 'redundantUseOfAwait',
//         suggest: [
//           {
//             messageId: 'removeAwait',
//             fix(fixer) {
//               const sourceCode = context.sourceCode;
//               const [awaitToken, tokenAfterAwait] = sourceCode.getFirstTokens(node, 2);

//               const areAwaitAndAwaitedExpressionOnTheSameLine = awaitToken.loc.start.line === tokenAfterAwait.loc.start.line;

//               if (!areAwaitAndAwaitedExpressionOnTheSameLine) {
//                 return null;
//               }

//               const [startOfAwait, endOfAwait] = awaitToken.range;

//               const characterAfterAwait = sourceCode.text[endOfAwait];
//               const trimLength = characterAfterAwait === ' ' ? 1 : 0;

//               const range: [number, number] = [startOfAwait, endOfAwait + trimLength];

//               return fixer.removeRange(range);
//             }
//           }
//         ]

//       });
//     }

//     return {
//       AwaitExpression(node) {
//         if (isInTailCallPosition(node) && !hasErrorHandler(node)) {
//           reportUnnecessaryAwait(node);
//         }
//       }
//     };
//   }
// });

// /**
//          * Checks if a node is placed in tail call position. Once `return` arguments (or arrow function expressions) can be a complex expression,
//          * an `await` expression could or could not be unnecessary by the definition of this rule. So we're looking for `await` expressions that are in tail position.
//          * @param node A node representing the `await` expression to check
//          * @returns The checking result
//          */
// function isInTailCallPosition(node: TSESTree.Node) {
//   if (node.parent?.type === AST_NODE_TYPES.ArrowFunctionExpression) {
//     return true;
//   }
//   if (node.parent?.type === AST_NODE_TYPES.ReturnStatement) {
//     return !hasErrorHandler(node.parent);
//   }
//   if (node.parent?.type === AST_NODE_TYPES.ConditionalExpression && (node === node.parent.consequent || node === node.parent.alternate)) {
//     return isInTailCallPosition(node.parent);
//   }
//   if (node.parent?.type === AST_NODE_TYPES.LogicalExpression && node === node.parent.right) {
//     return isInTailCallPosition(node.parent);
//   }
//   if (node.parent?.type === AST_NODE_TYPES.SequenceExpression && node === node.parent.expressions.at(-1)) {
//     return isInTailCallPosition(node.parent);
//   }
//   return false;
// }

// /**
//  * Determines whether a thrown error from this node will be caught/handled within this function rather than immediately halting
//  * this function. For example, a statement in a `try` block will always have an error handler. A statement in
//  * a `catch` block will only have an error handler if there is also a `finally` block.
//  * @param A node representing a location where an could be thrown
//  * @returns `true` if a thrown error will be caught/handled in this function
//  */
// function hasErrorHandler(node: TSESTree.Node) {
//   let ancestor = node;

//   while (!ASTUtils.isFunction(ancestor) && ancestor.type !== AST_NODE_TYPES.Program) {
//     if (ancestor.parent.type === AST_NODE_TYPES.TryStatement && (ancestor === ancestor.parent.block || (ancestor === ancestor.parent.handler && ancestor.parent.finalizer))) {
//       return true;
//     }
//     ancestor = ancestor.parent;
//   }
//   return false;
// }
