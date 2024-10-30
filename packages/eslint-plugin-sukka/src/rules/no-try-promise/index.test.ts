/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import { runTest } from '@eslint-sukka/internal';
import mod from '.';

runTest({
  module: mod,
  valid: [
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      async function okWithAwait() {
        try {
          await returningPromise();
        } catch (e) {
          console.log(e);
        }
      }
      `
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function okWithAnotherCall() {
        try {
          someFunc(); // can throw potentionally
          returningPromise();
        } catch (e) {
          console.log(e);
        }
      }
      `
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function okWithoutCatch() {
        try {
          returningPromise();
        } finally {
          console.log("finally");
        }
      }
      `
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function okWithNestedFunc() {
        try {
          let func = () => returningPromise();
        } catch (e) {
          console.log(e);
        }
      }
      `
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      async function okWithAwaitAndPromise() {
        try {
          await returningPromise(); // this can throw
          returningPromise();
        } catch (e) {
          console.log(e);
        }
      }
      `
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      async function * okWithYield() {
        try {
          yield returningPromise();
        } catch (e) {
          console.log(e);
        }
      }
      `
    }
  ],
  invalid: [
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function singlePromise() {
        try {
          returningPromise();
        } catch (e) {
          console.log(e);
        }
      }
      `,
      errors: [
        {
          messageId: 'addAwait',
          line: 4,
          endLine: 4,
          column: 9,
          endColumn: 12
        }
      ]
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function uselessTry() {
        try {
          returningPromise().catch();
        } catch (e) {
          console.log(e);
        }
      }
      `,
      errors: [
        {
          messageId: 'removeTry',
          line: 4,
          endLine: 4,
          column: 9,
          endColumn: 12
        }
      ]

    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function conditionalPromise(cond: boolean) {
        try {
          if (cond) {
            returningPromise();
          } else {
            let x = 42;
            returningPromise();
          }
        } catch (e) {
          console.log(e);
        }
      }
      `,
      errors: 1
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      async function severalTry() {
        try {
          await returningPromise();
        } catch (e) {
          console.log(e);
        }

        try {
          returningPromise();
        } catch (e) {
          console.log(e);
        }
      }
      `,
      errors: 1
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function newPromise() {
        try {
          new Promise((res, rej) => {});
        } catch (e) {
          console.log(e);
        }
      }
      `,
      errors: 1
    },
    {
      code: `
      function returningPromiseAndThrowing(cond: boolean) {
        if (cond) {
          return new Promise((res, rej) => {});
        } else {
          throw "error";
        }
      }

      // can be considered as False Positive as 'returningPromiseAndThrowing' can throw
      function testFunctionReturningPromiseAndThrowing(cond: boolean) {
        try {
          returningPromiseAndThrowing(cond);
        } catch (e) {
          console.log(e);
        }
      }
      `,
      errors: 1
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function uselessTryThenCatch() {
        try {
          returningPromise().then().catch();
        } catch (e) {
          console.log(e);
        }
      }
      `,
      errors: 1
    },
    {
      code: `
      function returningPromise() { return Promise.reject(); }
      function onlyOnePromiseWhenChainedPromise() {
        try {
          returningPromise().then(() => {});
        } catch (e) {
          console.log(e);
        }
      }
      `,
      errors: 1
    }
  ]
});
