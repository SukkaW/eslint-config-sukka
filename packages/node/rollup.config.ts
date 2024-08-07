import { createRollupConfig } from '@eslint-sukka/rollup-config';

export default createRollupConfig(new URL('./package.json', import.meta.url), [], {
  nodeResolve: true,
  commonjs: {
    ignoreDynamicRequires: true
  }
});
