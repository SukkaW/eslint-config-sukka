import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

import { MagicString } from '@napi-rs/magic-string';
import { defineConfig } from 'rollup';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
const external = Object.keys(packageJson.dependencies);

const CJSShim = `
// -- CommonJS Shims --
const foxquire = (id) => Promise.resolve(require(id));
`;
const CJSExportDefault = `
if (
  (
    typeof exports.default === 'function'
    || (typeof exports.default === 'object' && exports.default !== null)
  ) && typeof exports.default.__esModule === 'undefined'
) {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}
`;
const ESMShim = `
// -- ESM Shims --
const foxquire = (id) => import(id);
`;

export default defineConfig([{
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs', format: 'cjs', freeze: false, compact: true },
    { file: 'dist/index.js', format: 'cjs', freeze: false, compact: true },
    { file: 'dist/index.mjs', format: 'esm', compact: true }
  ],
  plugins: [
    {
      name: 'esm-cjs-bridge',
      renderChunk(code, _chunk, opts) {
        if (code.includes('foxquire')) {
          const ms = new MagicString(code);
          if (opts.format === 'es') {
            if (!code.includes(ESMShim)) {
              ms.prepend(ESMShim);
            }
          } else {
            if (!code.includes(CJSExportDefault)) {
              ms.append(CJSExportDefault);
            }
            if (!code.includes(CJSShim)) {
              ms.prepend(CJSShim);
            }
          }
          return {
            code: ms.toString(),
            map: ms.generateMap({ hires: true }).toMap()
          };
        }
        return null;
      }
    },
    json(),
    nodeResolve({
      exportConditions: ['import', 'require', 'default']
    }),
    commonjs({
      esmExternals: true
    }),
    swc({
      minify: true,
      jsc: {
        minify: {
          mangle: true,
          compress: true,
          module: true
        }
      }
    })
  ],
  external
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts'
  },
  plugins: [
    dts()
  ],
  external
}]);
