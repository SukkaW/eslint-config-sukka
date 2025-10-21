import type { ESLint } from 'eslint';

// eslint-plugin-sukka
import ban_eslint_disable from './rules/ban-eslint-disable';
import no_return_await from './rules/no-return-await';
import no_expression_empty_lines from './rules/no-expression-empty-lines';
import object_format from './rules/object-format';
import prefer_single_boolean_return from './rules/prefer-single-boolean-return';
import noAllDuplicatedBranches from './rules/no-duplicated-branches';
import noDuplicatedBranches from './rules/no-duplicated-branches';
import commaOrLogicalOrCase from './rules/comma-or-logical-or-case';
import noElementOverwrite from './rules/no-element-overwrite';
import classPrototype from './rules/class-prototype';
import boolParamDefault from './rules/bool-param-default';
import callArgumentLine from './rules/call-argument-line';
import trackTodoFixmeComment from './rules/track-todo-fixme-comment';
import noEmptyCollection from './rules/no-empty-collection';
import noEqualsInForTermination from './rules/no-equals-in-for-termination';
import noTopLevelThis from './rules/no-top-level-this';
import noInvariantReturns from './rules/no-invariant-returns';
import noRedundantAssignments from './rules/no-redundant-assignments';
import noSameLineConditional from './rules/no-same-line-conditional';
import noSmallSwitch from './rules/no-small-switch';
import noUnusedCollection from './rules/no-unused-collection';
import noUselessPlusplus from './rules/no-useless-plusplus';
import noChainArrayHigherOrderFunctions from './rules/no-chain-array-higher-order-functions';

import no_export_const_enum from './rules/no-export-const-enum';
import noForInIterable from './rules/no-for-in-iterable';
import onlyAwaitThenable from './rules/only-await-thenable';
import noUndefinedOptionalParameters from './rules/no-undefined-optional-parameters';
import noTryPromise from './rules/no-try-promise';
import noUselessStringOperation from './rules/no-useless-string-operation';

// eslint-disable-next-line sukka/type/no-force-cast-via-top-type -- bad @types/eslint type
export default {
  rules: Object.assign(
    {

      'ban-eslint-disable': ban_eslint_disable,

      'no-return-await': no_return_await,
      'no-expression-empty-lines': no_expression_empty_lines,
      'object-format': object_format,
      'prefer-single-boolean-return': prefer_single_boolean_return,
      'no-all-duplicated-branches': noAllDuplicatedBranches,
      'no-duplicated-branches': noDuplicatedBranches,
      'bool-param-default': boolParamDefault,
      'call-argument-line': callArgumentLine,
      'class-prototype': classPrototype,
      'comma-or-logical-or-case': commaOrLogicalOrCase,
      'track-todo-fixme-comment': trackTodoFixmeComment,
      'no-element-overwrite': noElementOverwrite,
      'no-empty-collection': noEmptyCollection,
      'no-equals-in-for-termination': noEqualsInForTermination,
      'no-top-level-this': noTopLevelThis,
      'no-invariant-returns': noInvariantReturns,
      'no-redundant-assignments': noRedundantAssignments,
      'no-same-line-conditional': noSameLineConditional,
      'no-small-switch': noSmallSwitch,
      'no-unused-collection': noUnusedCollection,
      'no-useless-plusplus': noUselessPlusplus,
      'no-chain-array-higher-order-functions': noChainArrayHigherOrderFunctions,
      'no-export-const-enum': no_export_const_enum,
      'no-for-in-iterable': noForInIterable,
      'only-await-thenable': onlyAwaitThenable,
      'no-undefined-optional-parameters': noUndefinedOptionalParameters,
      'no-try-promise': noTryPromise,
      'no-useless-string-operation': noUselessStringOperation
    }
  )
} as unknown as ESLint.Plugin;
