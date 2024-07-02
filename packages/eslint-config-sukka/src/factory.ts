import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import { ignores } from './modules/ignores';
import type { OptionsIgnores } from './modules/ignores';

import { comment } from './modules/eslint-comment';
import { promise } from './modules/promise';

import { javascript } from './modules/javascript';
import type { OptionsJavaScript } from './modules/javascript';

import { json } from './modules/json';

import { typescript } from './modules/typescript';
import type { OptionsTypeScript } from './modules/typescript';

import { legacy } from './modules/legacy';
import type { OptionsLegacy } from './modules/legacy';

import { isPackageExists } from 'local-pkg';
import picocolors from 'picocolors';
// import { isCI } from 'ci-info';

// This is a small hack to make rollup-plugin-dts bundle all these types
import type { OptionsReact, OptionsStyleX } from '../../react';
import type { OptionsNode } from '../../node';

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
  return options?.enable ?? defaults;
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
  deprecate('@eslint-sukka/legacy');

  const typescriptEnabled = enabled(options?.ts, isPackageExists('typescript'));

  flatConfigs.push(
    // ignores
    ignores(options?.ignores),
    // comments
    comment(),
    // promise,
    promise({ typescript: typescriptEnabled })
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
  if (typescriptEnabled) {
    flatConfigs.push(typescript(config(options?.ts)));
  }
  // react
  const nextjsInstalled = isPackageExists('next');
  if (enabled(options?.react, isPackageExists('react') || nextjsInstalled)) {
    if (!typescriptEnabled) {
      console.warn('[eslint-config-sukka] React module will not be enabled when TypeScript is not set up.');
    } else {
      const eslint_sukka_react = (await foxquire<typeof import('@eslint-sukka/react')>('@eslint-sukka/react'));
      flatConfigs.push(eslint_sukka_react.react(config(options?.react)));
      if (enabled(options?.next, nextjsInstalled)) {
        flatConfigs.push(eslint_sukka_react.next());
      }
      if (enabled(options?.stylex, isPackageExists('@stylexjs/stylex'))) {
        flatConfigs.push(eslint_sukka_react.stylex(config(options?.stylex)));
      }
    }
  }
  // node
  if (enabled(options?.node, isPackageExists('@types/node') || isPackageExists('@types/bun'))) {
    flatConfigs.push((await foxquire<typeof import('@eslint-sukka/node')>('@eslint-sukka/node')).node(config(options?.node)));
  }
  // legacy
  if (enabled(options?.legacy)) {
    flatConfigs.push(legacy(config(options?.legacy)));
  }

  flatConfigs.push(userConfig);

  return flatConfigs.flat();
};
