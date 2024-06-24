import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import { ignores } from './modules/ignores';
import type { OptionsIgnores } from './modules/ignores';

import { javascript } from './modules/javascript';
import type { OptionsJavaScript } from './modules/javascript';

import { json } from './modules/json';

import { typescript } from './modules/typescript';
import type { OptionsTypeScript } from './modules/typescript';

import { isPackageExists } from 'local-pkg';
import picocolors from 'picocolors';
// import { isCI } from 'ci-info';

// This is a small hack to make rollup-plugin-dts bundle all these types
import type { OptionsReact } from '../../react';
import type { OptionsNode } from '../../node';
import type { OptionsLegacy } from '../../legacy';
import { comment } from './modules/eslint-comment';
import { promise } from './modules/promise';

type SharedOptions<T = {}> = Omit<T, 'isInEditor'> & {
  enable?: boolean
};

interface ESLintSukkaOptions {
  isInEditor?: boolean,
  ignores?: SharedOptions<OptionsIgnores>,
  js?: SharedOptions<OptionsJavaScript> | boolean,
  json?: boolean,
  ts?: SharedOptions<OptionsTypeScript> | boolean,
  react?: SharedOptions<OptionsReact> | boolean,
  node?: SharedOptions<OptionsNode> | boolean,
  legacy?: SharedOptions<OptionsLegacy> | boolean
}

// function enabled<T extends boolean>(options: T): options is T;
// function enabled<T extends SharedOptions>(options: T | undefined): options is T;
// function enabled<T extends SharedOptions>(options: T | boolean | undefined, defaults: boolean): boolean;
function enabled<T extends SharedOptions>(options: T | boolean | undefined, defaults?: boolean | undefined): boolean {
  if (typeof options === 'boolean') return options;
  return options?.enable ?? defaults ?? false;
}

function config<T>(options: SharedOptions<T> | undefined | boolean): T | undefined {
  if (typeof options === 'boolean' || typeof options === 'undefined') return;
  const { enable, ...rest } = options;
  return rest as T;
}

function deprecate(pkg: string): void {
  if (isPackageExists(pkg)) {
    console.error(picocolors.yellow(`[eslint-config-sukka] "${pkg}" is deprecated and you should uninstall it`));
  }
}

export const sukka = async (options?: ESLintSukkaOptions, ...userConfig: FlatESLintConfigItem[]): Promise<FlatESLintConfigItem[]> => {
  // const isInEditor = options?.isInEditor ?? !!(
  //   (
  //     process.env.VSCODE_PID
  //     || process.env.VSCODE_CWD
  //     || process.env.JETBRAINS_IDE
  //     || process.env.VIM
  //   )
  //   && !isCI
  // );

  const flatConfigs: FlatESLintConfigItem[][] = [];

  deprecate('@eslint-sukka/js');
  deprecate('@eslint-sukka/json');
  deprecate('@eslint-sukka/ts');

  flatConfigs.push(
    // ignores
    ignores(options?.ignores),
    // comments
    comment(),
    // promise,
    promise()
  );
  // javascript
  if (enabled(options?.js, true)) {
    flatConfigs.push(javascript(config(options?.js)));
  }
  // json
  if (enabled(options?.json, true)) {
    flatConfigs.push(json());
  }
  // typescript
  const typescriptEnabled = enabled(options?.ts, isPackageExists('typescript'));
  if (typescriptEnabled) {
    flatConfigs.push(typescript(config(options?.ts)));
  }
  // react
  const reactEnabled = enabled(options?.react, isPackageExists('react') || isPackageExists('next'));
  if (reactEnabled) {
    if (!typescriptEnabled) {
      console.warn('[eslint-config-sukka] React module will not be enabled when TypeScript is not set up.');
    } else {
      flatConfigs.push((await foxquire<typeof import('@eslint-sukka/react')>('@eslint-sukka/react')).react(config(options?.react)));
    }
  }
  // node
  if (enabled(options?.node, isPackageExists('@types/node') || isPackageExists('@types/bun'))) {
    flatConfigs.push((await foxquire<typeof import('@eslint-sukka/node')>('@eslint-sukka/node')).node(config(options?.node)));
  }
  // legacy
  if (enabled(options?.legacy)) {
    flatConfigs.push((await foxquire<typeof import('@eslint-sukka/legacy')>('@eslint-sukka/legacy')).legacy(config(options?.legacy)));
  }

  flatConfigs.push(userConfig);

  return flatConfigs.flat();
};
