'use strict';

const { sukka } = require('eslint-config-sukka');

module.exports = sukka(
  {
    ignores: {
      customGlobs: [
        '**/_generated*'
      ]
    },
    node: true,
    react: {
      reactCompiler: true
    },
    yaml: true
  }
);
