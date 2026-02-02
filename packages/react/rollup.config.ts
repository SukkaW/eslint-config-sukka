import { createRollupConfig } from '@eslint-sukka/rollup-config';

export default createRollupConfig(new URL('./package.json', import.meta.url), ['eslint-plugin-import', 'eslint-plugin-import-x'], {
  buildCjsOnly: true,
  nodeResolve: true,
  commonjs: {
    ignoreDynamicRequires: true
  },
  json: true
});
