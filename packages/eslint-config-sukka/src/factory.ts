import type { FlatESLintConfigItem } from 'eslint-define-config';

import { ignores } from './modules/ignores';

import { isPackageExists } from 'local-pkg';

import type { OptionsIgnores } from './modules/ignores';
// This is a small hack to make rollup-plugin-dts bundle all these types
import type { OptionsJavaScript } from '../../js/src';
import type { OptionsTypeScript } from '../../ts/src';
import type { OptionsReact } from '../../react';
import type { OptionsNode } from '../../node';
import type { OptionsLegacy } from '../../legacy';

type SharedOptions<T = {}> = Omit<T, 'isInEditor'> & {
  enable?: boolean
};

interface ESLineSukkaOptions {
  isInEditor?: boolean,
  ignores?: SharedOptions<OptionsIgnores>,
  js?: SharedOptions<OptionsJavaScript> | boolean,
  ts?: SharedOptions<OptionsTypeScript>,
  react?: SharedOptions<OptionsReact> | boolean,
  node?: SharedOptions<OptionsNode> | boolean,
  legacy?: SharedOptions<OptionsLegacy> | boolean
}

const enabled = (options: SharedOptions | boolean | undefined, defaults = false): boolean => {
  if (typeof options === 'boolean') {
    return options;
  }
  return options?.enable ?? defaults;
};
const config = <T>(options: SharedOptions<T> | boolean | undefined, defaults?: T | undefined): T | undefined => {
  if (typeof options === 'boolean') {
    return defaults;
  }
  if (options) {
    const { enable, ...rest } = options;
    return rest as T;
  }
  return defaults;
}

export const sukka = async (options: ESLineSukkaOptions, ...userConfig: FlatESLintConfigItem[]): Promise<FlatESLintConfigItem[]> => {
  const isInEditor = options.isInEditor ?? !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE) && !process.env.CI);

  const flatConfigs: FlatESLintConfigItem[][] = [];

  // ignores
  flatConfigs.push(ignores(options.ignores));
  // javascript
  if (enabled(options.js, true)) {
    flatConfigs.push(
      (await foxquire<typeof import('@eslint-sukka/js')>('@eslint-sukka/js')).javascript({ ...config(options.js), isInEditor })
    );
  }
  // typescript
  if (options.ts && (options.ts.enable ?? isPackageExists('typescript'))) {
    flatConfigs.push(
      (await foxquire<typeof import('@eslint-sukka/ts')>('@eslint-sukka/ts')).typescript(options.ts)
    );
  }
  // react
  if (enabled(options.react)) {
    flatConfigs.push(
      (await foxquire<typeof import('@eslint-sukka/react')>('@eslint-sukka/react')).react(config(options.react))
    );
  }
  // node
  if (enabled(options.node)) {
    flatConfigs.push(
      (await foxquire<typeof import('@eslint-sukka/node')>('@eslint-sukka/node')).node(config(options.node))
    );
  }
  // legacy
  if (enabled(options.legacy)) {
    flatConfigs.push(
      (await foxquire<typeof import('@eslint-sukka/legacy')>('@eslint-sukka/legacy')).legacy(config(options.legacy))
    );
  }

  flatConfigs.push(userConfig);

  return flatConfigs.flat();
};
