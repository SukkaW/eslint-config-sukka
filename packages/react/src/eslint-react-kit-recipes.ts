import type { RuleFunction } from '@eslint-react/kit';
import eslintReactKitBuild from '@eslint-react/kit';

import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { TSESTree } from '@typescript-eslint/types';
import type { Scope } from '@typescript-eslint/utils/ts-eslint';
import { findVariable } from '@typescript-eslint/utils/ast-utils';

function isFunction({ type }: TSESTree.Node) {
  return type === AST_NODE_TYPES.FunctionDeclaration || type === AST_NODE_TYPES.FunctionExpression || type === AST_NODE_TYPES.ArrowFunctionExpression;
}

// --- custom-rules-of-state recipe ---

/** Prefer updater function form for useState setters that reference state */
function preferStateUpdaterFunction(): RuleFunction {
  return (context, { is, settings }) => {
    const setterToStateVar = new Map<Scope.Variable, Scope.Variable>();
    const pendingCalls: Array<{ callerVar: Scope.Variable, node: TSESTree.CallExpression }> = [];

    return {
      // eslint-disable-next-line @eslint-react/component-hook-factories -- this is not a react component
      CallExpression(node: TSESTree.CallExpression) {
        // this special trick is to overcome is.useStateLikeCall's wrong types
        // where it return asserts node is TSESTree.CallExpression, but it actually
        // accepts any CallExpression and returns boolean
        const n: TSESTree.Expression = node;
        if (is.useStateLikeCall(n, settings.additionalStateHooks)) {
          const { parent } = node;
          if (
            parent.type === AST_NODE_TYPES.VariableDeclarator
            && parent.id.type === AST_NODE_TYPES.ArrayPattern
          ) {
            const [stateEl, setterEl] = parent.id.elements;
            if (stateEl?.type === AST_NODE_TYPES.Identifier && setterEl?.type === AST_NODE_TYPES.Identifier) {
              const scope = context.sourceCode.getScope(node);
              const stateVar = findVariable(scope, stateEl.name);
              const setterVar = findVariable(scope, setterEl.name);
              if (stateVar != null && setterVar != null) {
                setterToStateVar.set(setterVar, stateVar);
              }
            }
          }
          return;
        }

        if (node.callee.type !== AST_NODE_TYPES.Identifier) return;
        const scope = context.sourceCode.getScope(node);
        const callerVar = findVariable(scope, node.callee.name);
        if (callerVar != null) {
          pendingCalls.push({ callerVar, node });
        }
      },

      'Program:exit': function () {
        for (const { callerVar, node } of pendingCalls) {
          if (!setterToStateVar.has(callerVar)) continue;
          const stateVar = setterToStateVar.get(callerVar)!;
          const arg = node.arguments[0];
          if (arg == null) continue;
          if (isFunction(arg)) continue;

          const [argStart, argEnd] = arg.range;
          const hasStateRef = stateVar.references.some(
            (ref) => argStart <= ref.identifier.range[0]
              && ref.identifier.range[1] <= argEnd
          );

          if (hasStateRef) {
            context.report({
              node,
              message: `Do not reference '${context.sourceCode.getText(node.callee)}' directly; use the updater function form instead.`
            });
          }
        }
      }
    };
  };
}

// --- no-circular-effect recipe ---

/** Detect circular dependencies between useEffect hooks via useState setters */
function noCircularEffect(): RuleFunction {
  return (context, { is, settings }) => {
    const { additionalStateHooks, additionalEffectHooks } = settings;
    const setterToState = new Map<Scope.Variable, Scope.Variable>();
    const pendingEffects: TSESTree.CallExpression[] = [];

    return {
      // eslint-disable-next-line @eslint-react/component-hook-factories -- this is not a react component
      CallExpression(node: TSESTree.CallExpression) {
        if (is.useStateLikeCall(node, additionalStateHooks)) {
          const { parent } = node;
          if (parent.type === AST_NODE_TYPES.VariableDeclarator && parent.id.type === AST_NODE_TYPES.ArrayPattern) {
            const [stateEl, setterEl] = parent.id.elements;
            if (stateEl?.type === AST_NODE_TYPES.Identifier && setterEl?.type === AST_NODE_TYPES.Identifier) {
              const scope = context.sourceCode.getScope(node);
              const stateVar = findVariable(scope, stateEl.name);
              const setterVar = findVariable(scope, setterEl.name);
              if (stateVar != null && setterVar != null) {
                setterToState.set(setterVar, stateVar);
              }
            }
          }
          return;
        }

        if (is.useEffectLikeCall(node, additionalEffectHooks)) {
          pendingEffects.push(node);
        }
      },

      'Program:exit': function () {
        interface EffectEdge {
          deps: Scope.Variable[],
          targets: Scope.Variable[],
          node: TSESTree.CallExpression
        }

        const stateVars = new Set(setterToState.values());
        const edges: EffectEdge[] = [];

        for (const node of pendingEffects) {
          const callback = node.arguments[0];
          const depsArg = node.arguments[1];
          if (callback == null || depsArg == null) continue;

          const deps: Scope.Variable[] = [];
          if (depsArg.type === AST_NODE_TYPES.ArrayExpression) {
            for (const el of depsArg.elements) {
              if (el?.type === AST_NODE_TYPES.Identifier) {
                const scope = context.sourceCode.getScope(el);
                const v = findVariable(scope, el.name);
                if (v != null && stateVars.has(v)) {
                  deps.push(v);
                }
              }
            }
          }
          if (deps.length === 0) continue;

          const targets: Scope.Variable[] = [];
          const [cbStart, cbEnd] = callback.range;
          for (const [setterVar, stateVar] of setterToState) {
            for (const ref of setterVar.references) {
              const [refStart, refEnd] = ref.identifier.range;
              if (refStart < cbStart || refEnd > cbEnd) continue;
              const { parent } = ref.identifier;
              if (parent?.type === AST_NODE_TYPES.CallExpression && parent.callee === ref.identifier) {
                targets.push(stateVar);
                break;
              }
            }
          }
          if (targets.length === 0) continue;

          edges.push({ deps, targets, node });
        }

        const graph = new Map<Scope.Variable, Set<Scope.Variable>>();
        for (const { deps, targets } of edges) {
          for (const dep of deps) {
            for (const target of targets) {
              if (!graph.has(dep)) graph.set(dep, new Set());
              graph.get(dep)!.add(target);
            }
          }
        }

        const visited = new Set<Scope.Variable>();
        const inStack = new Set<Scope.Variable>();
        const inCycle = new Set<Scope.Variable>();

        function dfs(v: Scope.Variable): boolean {
          if (inStack.has(v)) return true;
          if (visited.has(v)) return false;
          visited.add(v);
          inStack.add(v);

          // eslint-disable-next-line sukka/no-single-return -- we need to clean up stack
          let foundCycle = false;
          for (const neighbor of graph.get(v) ?? []) {
            if (dfs(neighbor)) {
              inCycle.add(v);
              inCycle.add(neighbor);
              // eslint-disable-next-line sukka/no-single-return -- we need to clean up stack
              foundCycle = true;
              break;
            }
          }

          inStack.delete(v);
          // eslint-disable-next-line sukka/no-single-return -- we need to clean up stack
          return foundCycle;
        }

        for (const v of graph.keys()) dfs(v);
        if (inCycle.size === 0) return;

        for (const { deps, targets, node } of edges) {
          const cycleDeps = deps.filter((d) => inCycle.has(d));
          const cycleTargets = targets.filter((t) => inCycle.has(t));
          if (cycleDeps.length === 0 || cycleTargets.length === 0) continue;

          const depNames = cycleDeps.map((d) => d.name).join(', ');
          const targetNames = cycleTargets.map((t) => t.name).join(', ');
          context.report({
            node,
            message: `Circular effect detected: this effect depends on [${depNames}] and updates [${targetNames}], creating an infinite update loop.`
          });
        }
      }
    };
  };
}

// --- Build the kit config ---

export const eslintReactKitConfig = eslintReactKitBuild()
  .use(preferStateUpdaterFunction)
  .use(noCircularEffect)
  .getConfig();
