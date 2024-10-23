import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import { ignores } from './modules/ignores';
import type { OptionsIgnores } from './modules/ignores';

import { comment } from './modules/eslint-comment';
import { promise } from './modules/promise';
import { regexp } from './modules/regexp';

import { javascript } from './modules/javascript';
import type { OptionsJavaScript } from './modules/javascript';

import { json } from './modules/json';

import { typescript } from './modules/typescript';
import type { OptionsTypeScript } from './modules/typescript';

import { legacy } from './modules/legacy';
import type { OptionsLegacy } from './modules/legacy';

import { isPackageExists } from '@eslint-sukka/shared';
import picocolors from 'picocolors';
import { defu } from 'defu';
// import { isCI } from 'ci-info';

// This is a small hack to make rollup-plugin-dts bundle all these types
import type { OptionsReact, OptionsStyleX } from '../../react';
import type { OptionsNode } from '../../node';
import { foxquire } from './foxquire';
import { isInEditorEnv } from './is-in-editor';

type SharedOptions<T = object> = Omit<T, 'isInEditor' | 'enable'> & {
  enable?: boolean
};

interface ESLintSukkaOptions {
  isInEditor?: boolean,
  ignores?: SharedOptions<OptionsIgnores>,
  js?: SharedOptions<OptionsJavaScript> | boolean,
  json?: boolean,
  ts?: SharedOptions<OptionsTypeScript> | boolean,
  react?: SharedOptions<OptionsReact> | boolean,
  stylex?: SharedOptions<OptionsStyleX> | boolean,
  next?: boolean,
  node?: SharedOptions<OptionsNode> | boolean,
  legacy?: SharedOptions<OptionsLegacy> | boolean
}

// function enabled<T extends boolean>(options: T): options is T;
// function enabled<T extends SharedOptions>(options: T | undefined): options is T;
// function enabled<T extends SharedOptions>(options: T | boolean | undefined, defaults: boolean): boolean;
function enabled<T extends SharedOptions>(options: T | boolean | undefined, defaults = false): boolean {
  if (typeof options === 'boolean') return options;
  if (typeof options === 'undefined') return defaults;
  if (options.enable) return true;
  return defaults;
}

function config<T>(options: SharedOptions<T> | undefined | boolean, ...defaults: Array<Omit<T, 'isInEditor' | 'enable'>>): T | undefined {
  let rest;
  if (typeof options === 'boolean' || typeof options === 'undefined') {
    rest = {} as SharedOptions<T>;
  } else {
    const { enable, ...$rest } = options;
    rest = $rest;
  }

  if (defaults.length) {
    return defu(rest, ...defaults) as T;
  }
  return rest as T;
}

function deprecate(pkg: string): void {
  if (isPackageExists(pkg)) {
    console.error(picocolors.yellow(`[eslint-config-sukka] "${pkg}" is deprecated and you should uninstall it`));
  }
}

export async function sukka(options?: ESLintSukkaOptions, ...userConfig: FlatESLintConfigItem[]): Promise<FlatESLintConfigItem[]> {
  const flatConfigs: FlatESLintConfigItem[][] = [];

  deprecate('@eslint-sukka/js');
  deprecate('@eslint-sukka/json');
  deprecate('@eslint-sukka/ts');
  deprecate('@eslint-sukka/legacy');

  const typescriptEnabled = enabled(options?.ts, isPackageExists('typescript'));

  flatConfigs.push(
    // ignores
    ignores(options?.ignores),
    // comments
    comment()
  );
  if (enabled(options?.js, true)) {
    flatConfigs.push(
      // javascript
      javascript(config(options?.js)),
      // promise,
      promise({ typescript: typescriptEnabled }),
      regexp()
    );
  }
  // json
  if (enabled(options?.json, true)) {
    flatConfigs.push(json());
  }
  // typescript
  if (typescriptEnabled) {
    const isInEditor = options?.isInEditor ?? isInEditorEnv();

    flatConfigs.push(typescript({
      isInEditor,
      ...config(options?.ts)
    }));
  }
  // react
  const nextjsInstalled = isPackageExists('next');
  const reactEnabled = enabled(options?.react, nextjsInstalled || isPackageExists('react') || isPackageExists('@types/react'));
  if (reactEnabled) {
    if (typescriptEnabled) {
      const eslint_sukka_react = (await foxquire<typeof import('@eslint-sukka/react')>('@eslint-sukka/react'));

      const remixInstalled = isPackageExists('@remix-run/node')
        || isPackageExists('@remix-run/react')
        || isPackageExists('@remix-run/serve')
        || isPackageExists('@remix-run/dev');

      flatConfigs.push(eslint_sukka_react.react(config(options?.react, {
        nextjs: nextjsInstalled,
        remix: remixInstalled,
        reactRefresh: {
          allowConstantExport: isPackageExists('vite')
        },
        reactCompiler: (isPackageExists('babel-plugin-react-compiler') || isPackageExists('react-compiler-webpack')) ? 'error' : 'off'
      })));
      if (enabled(options?.next, nextjsInstalled)) {
        flatConfigs.push(eslint_sukka_react.next());
      }
      if (enabled(options?.stylex, isPackageExists('@stylexjs/stylex') || isPackageExists('stylex-webpack'))) {
        flatConfigs.push(eslint_sukka_react.stylex(config(options?.stylex)));
      }
    } else {
      console.warn('[eslint-config-sukka] React preset will not be enabled when TypeScript is missing.');
    }
  }
  // node
  if (enabled(options?.node, isPackageExists('@types/node') || isPackageExists('@types/bun'))) {
    flatConfigs.push((await foxquire<typeof import('@eslint-sukka/node')>('@eslint-sukka/node')).node({
      ...config(options?.node),
      hasTypeScript: typescriptEnabled,
      hasReact: reactEnabled
    }));
  }
  // legacy
  if (enabled(options?.legacy)) {
    flatConfigs.push(legacy(config(options?.legacy)));
  }

  flatConfigs.push(userConfig);

  return flatConfigs.flat();
}
