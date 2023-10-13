import { createRule } from '../../../../../lib/create-eslint-rule';

export default createRule({
  name: 'no-const-enum',
  // defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow using `const enum` expression as it can not be inlined and tree-shaken by swc/esbuild/babel/webpack/rollup/vite/bun/rspack',
      recommended: 'recommended'
    },
    messages: {
      noConstEnum: 'Do not use `const enum` expression'
    },
    schema: []
  },

  create(context) {
    return {
      TSEnumDeclaration(node) {
        if (node.const) {
          context.report({
            node,
            messageId: 'noConstEnum'
          });
        }
      }
    };
  }
});
