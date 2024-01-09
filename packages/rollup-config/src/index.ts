import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { nodeResolve as nodeResolvePlugin } from '@rollup/plugin-node-resolve';
import commonjsPlugin from '@rollup/plugin-commonjs';
import type { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import type { RollupJsonOptions } from '@rollup/plugin-json';
import jsonPlugin from '@rollup/plugin-json';
import aliasPlugin from '@rollup/plugin-alias';
import type { RollupAliasOptions } from '@rollup/plugin-alias';
import { visualizer } from 'rollup-plugin-visualizer';

import { rollupFoxquire } from './rollup-foxquire';

import type { RollupOptions, OutputOptions as RollupOutputOptions, InputOption as RollupInputOption } from 'rollup';

import fs from 'fs';
import type { PathLike } from 'fs';

import { builtinModules } from 'module';

interface RollupConfigPlugin {
  input?: RollupInputOption,
  // Rollup Plugins
  nodeResolve?: boolean,
  commonjs?: boolean | RollupCommonJSOptions,
  json?: boolean | RollupJsonOptions,
  alias?: RollupAliasOptions | false,
  foxquire?: boolean,
  // Rollup output behaviors
  buildCjsOnly?: boolean,
  analyze?: boolean
}

const nonNullable = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined;

export const createRollupConfig = (
  packageJsonPath: PathLike,
  externalDependencies: string[] = [],
  {
    input = 'src/index.ts',
    nodeResolve = false,
    commonjs = false,
    json = false,
    alias = false,
    foxquire = false,
    buildCjsOnly = false,
    analyze = false
  }: RollupConfigPlugin = {}
): RollupOptions[] => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const external = Object.keys(packageJson.dependencies || {}).concat(builtinModules, externalDependencies, ['eslint']);

  return [{
    input,
    output: ([
      { file: 'dist/index.cjs', format: 'cjs', hoistTransitiveImports: false },
      buildCjsOnly ? null : { file: 'dist/index.mjs', format: 'esm', hoistTransitiveImports: false }
    ] satisfies Array<RollupOutputOptions | null>).filter(nonNullable),
    plugins: [
      foxquire && rollupFoxquire(),
      alias && aliasPlugin(alias),
      nodeResolve && nodeResolvePlugin({
        exportConditions: ['import', 'require', 'default']
      }),
      commonjs && commonjsPlugin({
        esmExternals: true,
        ...(typeof commonjs === 'boolean' ? {} : commonjs)
      }),
      json && jsonPlugin({
        compact: true,
        preferConst: true,
        ...(typeof json === 'boolean' ? {} : json)
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
      }),
      analyze && visualizer({})
    ],
    external(source) {
      return external.some((name) => source === name || source.startsWith(`${name}/`));
    }
  }, {
    input,
    output: {
      file: 'dist/index.d.ts'
    },
    plugins: [
      dts()
    ],
    external
  }];
};
