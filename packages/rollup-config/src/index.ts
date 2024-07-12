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
import replace from '@rollup/plugin-replace';

import { cleandir } from './rollup-cleandir';
import { rollupFoximport } from './rollup-foxquire';

import type { RollupOptions, OutputOptions as RollupOutputOptions, InputOption as RollupInputOption, GetManualChunk } from 'rollup';

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

const manualChunks: GetManualChunk = (id: string, { getModuleInfo }) => {
  if (id.includes('node_modules')) {
    const info = getModuleInfo(id);

    if (info && info.dynamicImporters.length > 0) {
      return 'vendor';
    }
  }
};

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
      {
        dir: 'dist',
        format: 'cjs',
        chunkFileNames: '[name]-[hash].cjs', entryFileNames: 'index.cjs',
        minifyInternalExports: true, hoistTransitiveImports: false,
        manualChunks,
        // This could breaks rollup runtime
        compact: false
      },
      buildCjsOnly
        ? null
        : {
          dir: 'dist',
          format: 'esm',
          chunkFileNames: '[name]-[hash].mjs', entryFileNames: 'index.mjs',
          minifyInternalExports: true, hoistTransitiveImports: false,
          manualChunks,
          // This could breaks rollup runtime
          compact: false
        }
    ] satisfies Array<RollupOutputOptions | null>).filter(nonNullable),
    plugins: [
      cleandir(),
      foxquire && rollupFoximport(),
      replace({
        values: {
          'typeof window': JSON.stringify('undefined'),
          'typeof document': JSON.stringify('undefined')
        },
        preventAssignment: true
      }),
      alias && aliasPlugin(alias),
      nodeResolve && nodeResolvePlugin({
        exportConditions: ['node', 'import', 'require', 'default']
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
          },
          transform: {
            optimizer: {
              globals: {
                typeofs: {
                  window: 'undefined',
                  document: 'undefined'
                }
              }
            }
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
      dts({
        respectExternal: true
      })
    ],
    external
  }];
};
