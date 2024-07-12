import type { Plugin as RollupPlugin } from 'rollup';
import fsp from 'fs/promises';

export function cleandir(): RollupPlugin {
  return {
    name: 'cleandir',
    async renderStart(outputOptions) {
      if (outputOptions.dir) {
        await fsp.rm(outputOptions.dir, { recursive: true, force: true });
        await fsp.mkdir(outputOptions.dir, { recursive: true });
      }
    }
  };
}
