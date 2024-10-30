import mod from '.';
import { runTest } from '@eslint-sukka/internal';

runTest({
  module: mod,
  valid: [
    {
      code: '// Just a regular comment'
    },
    {
      code: `
        // This is not aFIXME comment

        // notafixme comment

        // a fixmeal
        `
    },
    {
      code: '// Just a regular comment'
    },
    {
      code: `
        // This is not aTODO comment

        // notatodo comment

        // a todolist

        // método
        `
    },
    {
      code: '// todos'
    },
    {
      code: '// todos '
    }
  ],
  invalid: [
    {
      code: '// FIXME',
      errors: [
        {
          messageId: 'fixme',
          line: 1,
          endLine: 1,
          column: 4,
          endColumn: 9
        }
      ]
    },

    {
      code: `/*FIXME Multiline comment 
      FIXME: another fixme
      (this line is not highlighted)
      with three fixme
      */`,
      errors: [
        {
          messageId: 'fixme',
          line: 1,
          endLine: 1,
          column: 3,
          endColumn: 8
        },
        {
          messageId: 'fixme',
          line: 2,
          endLine: 2,
          column: 7,
          endColumn: 12
        },
        {
          messageId: 'fixme',
          line: 4,
          endLine: 4,
          column: 18,
          endColumn: 23
        }
      ]
    },
    {
      code: '// FIXME  FIXME',
      errors: 1
    },
    {
      code: `
      // FIXME just fix me 

      // FixMe just fix me 

      //fixme comment

      // This is a FIXME just fix me 

      // fixme: things to do

      // :FIXME: things to do

      // valid end of line fixme

      /*
      FIXME Multiline comment 
      */

      /*
      FIXME Multiline comment 

        with two fixme
      */

      // valid end of file FIXME
        `,
      errors: 11
    },
    {
      code: '// TODO',
      errors: [
        {
          messageId: 'todo',
          line: 1,
          endLine: 1,
          column: 4,
          endColumn: 8
        }
      ]
    },

    {
      code: `/*TODO Multiline comment 
      TODO: another todo
      (this line is not highlighted)
      with three todo
      */`,
      errors: [
        {
          messageId: 'todo',
          line: 1,
          endLine: 1,
          column: 3,
          endColumn: 7
        },
        {
          messageId: 'todo',
          line: 2,
          endLine: 2,
          column: 7,
          endColumn: 11
        },
        {
          messageId: 'todo',
          line: 4,
          endLine: 4,
          column: 18,
          endColumn: 22
        }
      ]
    },
    {
      code: '// TODO  TODO',
      errors: 1
    },
    {
      code: `
      // TODO just do it

      // Todo just do it

      //todo comment

      // This is a TODO just do it

      // todo: things to do

      // :TODO: things to do

      // valid end of line todo

      /*
        TODO Multiline comment 
      */

      /*
        TODO Multiline comment 

        with two todo
      */

      // valid end of file TODO
        `,
      errors: 11
    }
  ]
});
