import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { nodeResolve as nodeResolvePlugin } from '@rollup/plugin-node-resolve';
import commonjsPlugin from '@rollup/plugin-commonjs';
import type { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import type { RollupJsonOptions } from '@rollup/plugin-json';
import jsonPlugin from '@rollup/plugin-json';
import aliasPlugin from '@rollup/plugin-alias';
import type { RollupAliasOptions } from '@rollup/plugin-alias';
import * as bundleAnalyzer from 'vite-bundle-analyzer';
import replace from '@rollup/plugin-replace';

import { rollupFoximport } from './rollup-foxquire';

import type { RollupOptions, OutputOptions as RollupOutputOptions, InputOption as RollupInputOption, GetManualChunk } from 'rollup';
import type { PackageJson } from '@package-json/types';

import fs from 'node:fs';
import type { PathLike } from 'node:fs';

import { builtinModules } from 'node:module';

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
  analyze?: boolean,
  /**
   * @default true
   */
  externalLiveBindings?: boolean
}

const manualChunks: GetManualChunk = (id: string, { getModuleInfo }) => {
  if (id.includes('node_modules')) {
    const info = getModuleInfo(id);

    if (info && info.dynamicImporters.length > 0) {
      return 'vendor';
    }
  }
};

const defaultExternal = [
  'eslint'
];

export function createRollupConfig(packageJsonPath: PathLike,
  externalDependencies: string[] = [],
  {
    input = 'src/index.ts',
    nodeResolve = false,
    commonjs = false,
    json = false,
    alias = false,
    foxquire = false,
    buildCjsOnly = false,
    analyze = false,
    /**
     * When enabled, this could prevent cjs-module-lexer from detecting re-exports
     * However, it might trigger issues with circular dependencies when disabled
     * Please disable it wisely, this is enabled by default
     */
    externalLiveBindings = true
  }: RollupConfigPlugin = {}): RollupOptions[] {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageJson;
  const $external = Object.keys(packageJson.dependencies || {}).concat(Object.keys(packageJson.peerDependencies || {})).concat(builtinModules, externalDependencies, defaultExternal);

  const external = (source: string) => (
    source.startsWith('node:')
    || source.startsWith('bun:')
    || source.startsWith('@eslint-sukka/')
    || $external.some((name) => source === name || source.startsWith(`${name}/`))
  );

  fs.rmSync('dist', { recursive: true, force: true });
  fs.mkdirSync('dist', { recursive: true });

  return [{
    input,
    output: buildCjsOnly
      ? {
        dir: 'dist',
        format: 'cjs',
        chunkFileNames: '[name]-[hash].cjs', entryFileNames: 'index.cjs',
        minifyInternalExports: true, hoistTransitiveImports: false,
        manualChunks,
        // This could breaks rollup runtime
        compact: true,
        //
        // however it might trigger issues with circular dependencies
        externalLiveBindings
      } satisfies RollupOutputOptions
      : [
        {
          dir: 'dist',
          format: 'cjs',
          chunkFileNames: '[name]-[hash].cjs', entryFileNames: 'index.cjs',
          minifyInternalExports: true, hoistTransitiveImports: false,
          manualChunks,
          // This could breaks rollup runtime
          compact: false,
          externalLiveBindings
        },
        {
          dir: 'dist',
          format: 'esm',
          chunkFileNames: '[name]-[hash].mjs', entryFileNames: 'index.mjs',
          minifyInternalExports: true, hoistTransitiveImports: false,
          manualChunks,
          // This could breaks rollup runtime
          compact: false,
          externalLiveBindings
        }
      ] satisfies RollupOutputOptions[],
    plugins: [
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
        // minify: true,
        // jsc: {
        //   minify: {
        //     mangle: true,
        //     compress: true,
        //     module: true
        //   },
        //   transform: {
        //     optimizer: {
        //       globals: {
        //         typeofs: {
        //           window: 'undefined',
        //           document: 'undefined'
        //         }
        //       }
        //     }
        //   }
        // }
      }),
      analyze && bundleAnalyzer.adapter(bundleAnalyzer.analyzer())
    ],
    external
  },
  {
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
}
