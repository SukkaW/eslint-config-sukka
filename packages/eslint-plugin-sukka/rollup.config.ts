import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { defineConfig } from 'rollup';
import alias from '@rollup/plugin-alias';

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
    alias({
      entries: [
        { find: 'lodash', replacement: 'lodash-unified' }
      ]
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
  ]
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts'
  },
  plugins: [
    dts()
  ]
}]);
