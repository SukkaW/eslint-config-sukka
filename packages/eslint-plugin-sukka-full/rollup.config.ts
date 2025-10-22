import { createRollupConfig } from '@eslint-sukka/rollup-config';

export default createRollupConfig(new URL('./package.json', import.meta.url), [], {
  nodeResolve: true,
  commonjs: true,
  json: true,
  alias: {
    entries: [
      { find: 'lodash', replacement: 'lodash-unified' }
    ]
  },
  buildCjsOnly: true
});
