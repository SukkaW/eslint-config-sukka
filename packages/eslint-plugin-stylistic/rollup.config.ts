import { createRollupConfig } from '@eslint-sukka/rollup-config';

export default createRollupConfig(new URL('./package.json', import.meta.url), [], {
  buildCjsOnly: true,
  // rollup plugins
  nodeResolve: true,
  commonjs: {
    ignoreDynamicRequires: false,
    transformMixedEsModules: true
  },
  json: true,
  analyze: false,
  replace: {
    values: {
      '__require(': 'require('
    },
    delimiters: ['', '']
  }
});
