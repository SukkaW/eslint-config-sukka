import { createRollupConfig } from '@eslint-sukka/rollup-config';

export default createRollupConfig(new URL('./package.json', import.meta.url), [], {
  foxquire: true,
  nodeResolve: true,
  commonjs: true,
  analyze: false,
  buildCjsOnly: true,
  externalLiveBindings: false
});
