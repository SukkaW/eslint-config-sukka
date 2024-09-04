import { createRule } from '@eslint-sukka/shared';
import { AST_NODE_TYPES, ASTUtils, type TSESTree } from '@typescript-eslint/utils';

export default createRule({
  name: 'no-export-const-enum',
  // defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow using `const enum` expression as it can not be inlined and tree-shaken by swc/esbuild/babel/webpack/rollup/vite/bun/rspack'
      // recommended: 'recommended'
    },
    messages: {
      noConstEnum: 'Do not use `const enum` expression'
    },
    schema: []
  },

  create(context) {
    const reportTsEnumDeclarationInExportDeclaration = (
      node: TSESTree.ExportDefaultDeclaration | TSESTree.ExportNamedDeclaration,
      id: TSESTree.Identifier
    ) => {
      const variable = ASTUtils.findVariable(
        context.sourceCode.getScope(node),
        id
      );
      variable?.defs.forEach((def) => {
        if (def.node.type === AST_NODE_TYPES.TSEnumDeclaration && def.node.const) {
          context.report({
            node,
            messageId: 'noConstEnum'
          });
        }
      });
    };

    return {
      ExportNamedDeclaration(node) {
        const decl = node.declaration;
        if (decl?.type === AST_NODE_TYPES.TSEnumDeclaration && decl.const) {
          context.report({
            node,
            messageId: 'noConstEnum'
          });
          return;
        }
        if (decl?.type === AST_NODE_TYPES.VariableDeclaration) {
          const id = decl.declarations[0].id;
          if (id.type === AST_NODE_TYPES.Identifier) {
            reportTsEnumDeclarationInExportDeclaration(node, id);
          }
        }
      },
      ExportDefaultDeclaration(node) {
        const decl = node.declaration;
        if (decl.type === AST_NODE_TYPES.Identifier) {
          reportTsEnumDeclarationInExportDeclaration(node, decl);
        }
      }
    };
  }
});
