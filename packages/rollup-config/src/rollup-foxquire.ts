import type { Plugin } from 'rollup';

import { MagicString } from '@napi-rs/magic-string';

const CJSShim = `
// -- CommonJS Shims --
const foximport = (id) => Promise.resolve(require(id));
`;
const ESMShim = `
// -- ESM Shims --
const foximport = (id) => import(id);
`;

export function rollupFoximport(): Plugin {
  return {
    name: 'esm-cjs-bridge',
    renderChunk(code, _chunk, opts) {
      if (code.includes('foximport')) {
        const ms = new MagicString(code);
        if (opts.format === 'es') {
          if (!code.includes(ESMShim)) {
            ms.prepend(ESMShim);
          }
        } else if (!code.includes(CJSShim)) {
          ms.prepend(CJSShim);
        }
        return {
          code: ms.toString(),
          map: ms.generateMap({ hires: true }).toMap()
        };
      }
      return null;
    }
  };
}
