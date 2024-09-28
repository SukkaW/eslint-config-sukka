import { runTest } from '../../../../../lib/eslint-plugin-tester';
import mod from '.';

runTest({
  module: mod,
  valid: [
    'for (var i = 0; i > 10; i += 1) { }', // Compliant, not an equality in condition
    'for (var i = 0; i != 10; i *= 1) { }', // Compliant, not an inc/dec update

    'for (var i = 0; i != 10; i++) { }', // Compliant, trivial update operation increasing from 0 to 10
    'for (var i = 10; i != 0; i--) { }', // Compliant, trivial update operation decreasing from 10 to 0
    'for (var i = 0; i != 10; i += 1) { }', // Compliant, trivial update operation
    'for (var i = 10; i != 0; i -= 1) { }', // Compliant, trivial update operation
    'for (var i = 10; i !== 0; i -= 1) { }', // Compliant, trivial update operation

    'var j = 20; for (j = 0; j != 10; j++) { }', // Compliant, trivial update operation

    // Compliant tests: non trivial condition exception
    'for (i = 0; checkSet[i] != null; i++) { }',
    'for (i = 0, k = 0; j != null; i++, k--) { }', // Non trivial, j is not updated
    'for (; checkSet[i] != null; i++) { }',
    'for (i = 0; foo(i) == 42; i++) { }',
    'for (cur = event.target; cur != this; cur = cur.parentNode || this) { }',
    'for (var i = 0; ; i += 1) { }', // Compliant, no condition
    'for (var i = 0; i != 10;) { }', // Compliant, no update
    'for (var i = 0; i >= 10;) { }' // Compliant, no update
  ],
  invalid: [
    {
      // Noncompliant {{Replace '!=' operator with one of '<=', '>=', '<', or '>' comparison operators.}}
      code: 'for (var i = 0; i != 2; i += 2) { }',
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    },
    {
      code: 'for (i = 0; i == 2; i += 2) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '==' }
      }]
    },
    {
      code: 'for (i = 10; i == 0; i--) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '==' }
      }]
    },
    {
      code: 'for (let i = 0; i === 10; i++) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '===' }
      }]
    },
    {
      code: 'for (i = from, j = 0; i != to; i += dir, j++) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    },

    // even if trivial update operation, we have equality in condition

    // not a trivial update
    {
      code: 'for (let i = 0; i !== 2; i += 2) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!==' }
      }]
    },

    // trivial update, but init is higher than stop and update is increasing
    {
      code: 'for (let i = 10; i != 0; i++) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    },

    // trivial update, but init is lower than stop and update is decreasing
    {
      code: 'for (let i = 0; i != 10; i -= 1) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    },

    // trivial update operation with wrong init
    {
      code: 'for (let i = \'a\'; i != 0; i -= 1) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    },

    // trivial update, but init is lower than stop

    {
      code: 'let j = 20; for (j = 0; j != 10; j--) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    },

    // not a non-trivial condition exception, updated counter is not in the condition
    {
      code: 'for (i = 0, k = 0; k != null; i++, k--) { }', // Noncompliant
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    },

    {
      code: 'for (let i = 0; i != 10; i += 1) { i++; }', // Noncompliant changes to counter -> no exception
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    },

    {
      code: 'let iii = 0; for (let i = 0; iii != 10; iii += 1) { iii++; }', // Noncompliant changes to counter -> no exception
      errors: [{
        messageId: 'replaceOperator',
        data: { operator: '!=' }
      }]
    }
  ]
});
