import type { RuleContext } from '@eslint-sukka/shared';
import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { TSESTree } from '@typescript-eslint/types';
import type { TSESLint } from '@typescript-eslint/utils';

type CallLikeExpression =
  | TSESTree.CallExpression
  | TSESTree.NewExpression
  | TSESTree.AwaitExpression;
export class CallLikeExpressionVisitor<TRuleContext extends RuleContext<string, unknown[]>> {
  private readonly callLikeExpressions: CallLikeExpression[] = [];

  static readonly getCallExpressions = <TRuleContext extends RuleContext<string, unknown[]>>(node: TSESTree.Node, context: TRuleContext) => {
    const visitor = new CallLikeExpressionVisitor();
    visitor.visit(node, context);
    return visitor.callLikeExpressions;
  };

  protected visit(root: TSESTree.Node, context: TRuleContext) {
    const visitNode = (node: TSESTree.Node) => {
      switch (node.type) {
        case AST_NODE_TYPES.AwaitExpression:
        case AST_NODE_TYPES.CallExpression:
        case AST_NODE_TYPES.NewExpression:
          this.callLikeExpressions.push(node);
          break;
        case AST_NODE_TYPES.FunctionDeclaration:
        case AST_NODE_TYPES.FunctionExpression:
        case AST_NODE_TYPES.ArrowFunctionExpression:
          return;
        default:
          // noop
      }

      childrenOf(node, context.sourceCode.visitorKeys).forEach(visitNode);
    };
    visitNode(root);
  }
}

function childrenOf(node: TSESTree.Node, visitorKeys: TSESLint.Parser.VisitorKeys): TSESTree.Node[] {
  const children = [];
  const keys = visitorKeys[node.type] as readonly string[] | undefined;

  if (keys?.length) {
    for (const key of keys) {
      /**
       * A node's child may be a node or an array of nodes, e.g., `body` in `estree.Program`.
       * If it's an array, we extract all the nodes from it; if not, we just add the node.
       */
      const child = node[key as keyof typeof node];
      if (Array.isArray(child)) {
        children.push(...child);
      } else {
        children.push(child);
      }
    }
  }

  return children.filter(Boolean) as TSESTree.Node[];
}
