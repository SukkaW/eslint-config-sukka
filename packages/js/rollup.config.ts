import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
const external = Object.keys(packageJson.dependencies).concat(['@typescript-eslint/parser']);

export default defineConfig([{
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs', format: 'cjs' },
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'esm' }
  ],
  plugins: [
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
