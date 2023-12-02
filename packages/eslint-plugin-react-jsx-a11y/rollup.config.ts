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
      'es-iterator-helpers': '@nolyfill/es-iterator-helpers',
      'array-includes': '@nolyfill/array-includes',
      'array.prototype.tosorted': '@nolyfill/array.prototype.tosorted',
      'array.prototype.flat': '@nolyfill/array.prototype.flat',
      'array.prototype.flatmap': '@nolyfill/array.prototype.flatmap',
      'string.prototype.matchall': '@nolyfill/string.prototype.matchall',
      'object.values': '@nolyfill/object.values',
      'object.assign': '@nolyfill/object.assign',
      'object.entries': '@nolyfill/object.entries',
      'object.fromentries/polyfill': '@nolyfill/object.fromentries/polyfill',
      'object.fromentries': '@nolyfill/object.fromentries',
      'object.hasown/polyfill': '@nolyfill/object.hasown/polyfill',
      'object.hasown': '@nolyfill/object.hasown',
      hasown: '@nolyfill/hasown'
    }
  },
  analyze: false
});
