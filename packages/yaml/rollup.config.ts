import { createRollupConfig } from '@eslint-sukka/rollup-config';

export default createRollupConfig(new URL('./package.json', import.meta.url), [], {
  nodeResolve: true,
  json: true,
  commonjs: {
    ignoreDynamicRequires: true
  },
  buildCjsOnly: true
});
