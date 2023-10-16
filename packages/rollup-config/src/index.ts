import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { nodeResolve as nodeResolvePlugin } from '@rollup/plugin-node-resolve';
import commonjsPlugin from '@rollup/plugin-commonjs';
import jsonPlugin from '@rollup/plugin-json';

import aliasPlugin from '@rollup/plugin-alias';
import type { RollupAliasOptions } from '@rollup/plugin-alias';

import { rollupFoxquire } from './rollup-foxquire';

import { defineConfig } from 'rollup';

import fs from 'fs';
import type { PathLike } from 'fs';

import { builtinModules } from 'module';

declare global {
  interface JSON {
    parse(text: string | Buffer, reviver?: (this: any, key: string, value: any) => any): any
  }
}

interface RollupConfigPlugin {
  nodeResolve?: boolean,
  commonjs?: boolean,
  json?: boolean,
  alias?: RollupAliasOptions | false,
  foxquire?: boolean
}

export const createRollupConfig = (
  packageJsonPath: PathLike,
  externalDependencies: string[] = [],
  {
    nodeResolve = false,
    commonjs = false,
    json = false,
    alias = false,
    foxquire = false
  }: RollupConfigPlugin = {}
) => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
  const external = Object.keys(packageJson.dependencies || {}).concat(builtinModules, externalDependencies, ['eslint']);

  return defineConfig([{
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs', format: 'cjs' },
      { file: 'dist/index.js', format: 'cjs' },
      { file: 'dist/index.mjs', format: 'esm' }
    ],
    plugins: [
      foxquire && rollupFoxquire(),
      alias && aliasPlugin(alias),
      nodeResolve && nodeResolvePlugin({
        exportConditions: ['import', 'require', 'default']
      }),
      commonjs && commonjsPlugin({
        esmExternals: true
      }),
      json && jsonPlugin(),
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
};
