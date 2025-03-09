'use strict';

const { sukka, constants } = require('eslint-config-sukka');

module.exports = sukka(
  {
    ignores: {
      customGlobs: [
        ...constants.GLOB_EXCLUDE,
        '**/_generated*'
      ]
    },
    node: true,
    react: true,
    yaml: true
  }
);
