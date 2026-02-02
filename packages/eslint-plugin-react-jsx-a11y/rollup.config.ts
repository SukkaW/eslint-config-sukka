import { createRollupConfig } from '@eslint-sukka/rollup-config';

export default createRollupConfig(new URL('./package.json', import.meta.url), [
  'eslint'
], {
  buildCjsOnly: true,
  // rollup plugins
  nodeResolve: true,
  commonjs: {
    ignoreDynamicRequires: true
  },
  json: true,
  alias: {
    entries: {
      'array-includes': '@nolyfill/array-includes',
      'array.prototype.flat': '@nolyfill/array.prototype.flat',
      'array.prototype.flatmap': '@nolyfill/array.prototype.flatmap',
      'object.values': '@nolyfill/object.values',
      'object.assign': '@nolyfill/object.assign',
      'object.fromentries': '@nolyfill/object.fromentries',
      hasown: '@nolyfill/hasown'
    }
  },
  analyze: false
});
