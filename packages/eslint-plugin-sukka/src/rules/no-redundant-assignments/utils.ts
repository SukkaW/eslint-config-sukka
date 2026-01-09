import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { TSESTree } from '@typescript-eslint/types';
import type { TSESLint } from '@typescript-eslint/utils';

export function getVariableFromIdentifier(identifier: TSESTree.Identifier, scope: TSESLint.Scope.Scope) {
  let variable = scope.variables.find(value => value.name === identifier.name);
  if (!variable && scope.upper) {
    variable = scope.upper.variables.find(value => value.name === identifier.name);
  }
  return variable;
}

export function reachingDefinitions(reachingDefinitionsMap: Map<string, ReachingDefinitions>) {
  const worklist = Array.from(reachingDefinitionsMap.values(), defs => defs.segment);

  while (worklist.length) {
    const current = worklist.pop()!;
    const reachingDefs = reachingDefinitionsMap.get(current.id)!;
    const outHasChanged = reachingDefs.propagate(reachingDefinitionsMap);
    if (outHasChanged) {
      current.nextSegments.forEach(next => worklist.push(next));
    }
  }
}

export class AssignedValues extends Set<string> {
  type = 'AssignedValues' as const;
}

const assignedValues = (val: string) => new AssignedValues([val]);

interface UnknownValue {
  type: 'UnknownValue'
}
const unknownValue: UnknownValue = {
  type: 'UnknownValue'
};

export type Values = AssignedValues | UnknownValue;

export class ReachingDefinitions {
  constructor(public segment: TSESLint.CodePathSegment) {}

  in = new Map<TSESLint.Scope.Variable, Values>();

  out = new Map<TSESLint.Scope.Variable, Values>();

  /**
   * collects references in order they are evaluated, set in JS maintains insertion order
   */
  references = new Set<TSESLint.Scope.Reference>();

  add(ref: TSESLint.Scope.Reference) {
    const variable = ref.resolved;
    if (variable) {
      this.references.add(ref);
    }
  }

  propagate(reachingDefinitionsMap: Map<string, ReachingDefinitions>) {
    this.in.clear();
    this.segment.prevSegments.forEach(prev => {
      this.join(reachingDefinitionsMap.get(prev.id)!.out);
    });
    const newOut = new Map<TSESLint.Scope.Variable, Values>();
    this.references.forEach(ref => this.updateProgramState(ref, newOut));
    if (!equals(this.out, newOut)) {
      this.out = newOut;
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this -- fuck sonarjs
  updateProgramState(ref: TSESLint.Scope.Reference, programState: Map<TSESLint.Scope.Variable, Values>) {
    const variable = ref.resolved;
    if (!variable || !ref.isWrite()) {
      return;
    }
    if (!ref.writeExpr) {
      programState.set(variable, unknownValue);
      return;
    }
    const rhsValues = resolveAssignedValues(variable, ref.writeExpr, programState, ref.from);
    programState.set(variable, rhsValues);
  }

  join(previousOut: Map<TSESLint.Scope.Variable, Values>) {
    for (const [key, values] of previousOut.entries()) {
      const inValues = this.in.get(key) ?? new AssignedValues();
      if (inValues.type === 'AssignedValues' && values.type === 'AssignedValues') {
        values.forEach(val => inValues.add(val));
        this.in.set(key, inValues);
      } else {
        this.in.set(key, unknownValue);
      }
    }
  }
}

function equals(ps1: Map<TSESLint.Scope.Variable, Values>, ps2: Map<TSESLint.Scope.Variable, Values>) {
  if (ps1.size !== ps2.size) {
    return false;
  }
  for (const [variable, values1] of ps1) {
    if (!ps2.has(variable) || !valuesEquals(ps2.get(variable)!, values1)) {
      return false;
    }
  }
  return true;
}

function valuesEquals(a: Values, b: Values) {
  if (a.type === 'AssignedValues' && b.type === 'AssignedValues') {
    return setEquals(a, b);
  }
  return a === b;
}

function setEquals<T>(a: Set<T>, b: Set<T>): boolean {
  return a.size === b.size && [...a].every(e => b.has(e));
}

export function resolveAssignedValues(
  lhsVariable: TSESLint.Scope.Variable,
  writeExpr: TSESTree.Node | null | undefined,
  assignedValuesMap: Map<TSESLint.Scope.Variable, Values>,
  scope: TSESLint.Scope.Scope
): Values {
  if (!writeExpr) {
    return unknownValue;
  }
  switch (writeExpr.type) {
    case AST_NODE_TYPES.Literal:
      return writeExpr.raw ? assignedValues(writeExpr.raw) : unknownValue;
    case AST_NODE_TYPES.Identifier: {
      const resolvedVar = getVariableFromIdentifier(writeExpr, scope);
      if (resolvedVar && resolvedVar !== lhsVariable) {
        return assignedValuesMap.get(resolvedVar) ?? unknownValue;
      }
      return unknownValue;
    }
    default:
      return unknownValue;
  }
}

export class CodePathContext {
  reachingDefinitionsMap = new Map<string, ReachingDefinitions>();
  reachingDefinitionsStack: ReachingDefinitions[] = [];
  segments = new Map<string, TSESLint.CodePathSegment>();
  assignmentStack: AssignmentContext[] = [];

  constructor(public codePath: TSESLint.CodePath) {}
}

export class AssignmentContext {
  constructor(public node: TSESTree.AssignmentExpression | TSESTree.VariableDeclarator) {}

  public lhs = new Set<TSESLint.Scope.Reference>();
  public rhs = new Set<TSESLint.Scope.Reference>();

  isRhs(node: TSESTree.Node) {
    return this.node.type === AST_NODE_TYPES.AssignmentExpression
      ? this.node.right === node
      : this.node.init === node;
  }

  isLhs(node: TSESTree.Node) {
    return this.node.type === AST_NODE_TYPES.AssignmentExpression
      ? this.node.left === node
      : this.node.id === node;
  }

  add(ref: TSESLint.Scope.Reference) {
    let parent = ref.identifier;
    while (parent) {
      if (this.isLhs(parent)) {
        this.lhs.add(ref);
        break;
      }
      if (this.isRhs(parent)) {
        this.rhs.add(ref);
        break;
      }
      parent = parent.parent;
    }
    // if (parent == null) {
    //   throw new Error('failed to find assignment lhs/rhs');
    // }
  }
}

export function peek<T>(arr: T[]) {
  return arr[arr.length - 1];
}

export function isSelfAssignement(ref: TSESLint.Scope.Reference) {
  if (ref.writeExpr?.type === AST_NODE_TYPES.Identifier) {
    return /* lhs */ ref.resolved === /* rhs */ getVariableFromIdentifier(ref.writeExpr, ref.from);
  }
  return false;
}

export function isCompoundAssignment(writeExpr: TSESTree.Node | null | undefined) {
  if (writeExpr?.parent) {
    const node = writeExpr.parent;
    return node?.type === AST_NODE_TYPES.AssignmentExpression && node.operator !== '=';
  }
  return false;
}

export function isDefaultParameter(ref: TSESLint.Scope.Reference) {
  if (ref.identifier.type !== AST_NODE_TYPES.Identifier) {
    return false;
  }
  return (ref.identifier.parent).type === AST_NODE_TYPES.AssignmentPattern;
}
