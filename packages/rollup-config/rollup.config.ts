import { createRollupConfig } from './src';

export default createRollupConfig(
  new URL('./package.json', import.meta.url),
  [
    'rollup-plugin-swc3',
    'rollup-plugin-dts',
    'rollup',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-json',
    '@rollup/plugin-commonjs',
    'fs',
    '@rollup/plugin-alias',
    'rollup-plugin-visualizer'
  ]
);
