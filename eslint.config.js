'use strict';

const { sukka, constants } = require('eslint-config-sukka');

module.exports = sukka(
  {
    ignores: {
      customGlobs: [
        ...constants.GLOB_EXCLUDE,
        '**/_generated*',
        'eslint.config.js'
      ]
    },
    node: true,
    react: true
  }
);
