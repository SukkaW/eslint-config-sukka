import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig([{
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs', format: 'cjs' },
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'esm' }
  ],
  plugins: [
    nodeResolve(),
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
  external: [
    '@stylistic/eslint-plugin-js',
    // '@masknet/eslint-plugin' // not stable, bundle the dependency with me
  ]
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts'
  },
  plugins: [
    dts()
  ],
  external: ['@stylistic/eslint-plugin-js']
}]);
