import type { FlatESLintConfigItem } from 'eslint-define-config';

import { ignores } from './modules/ignores';
import type { OptionsIgnores } from './modules/ignores';

import { isPackageExists } from 'local-pkg';

import type { OptionsJavaScript } from '@eslint-sukka/js';
import type { OptionsTypeScript } from '@eslint-sukka/ts';
import type { OptionsReact } from '@eslint-sukka/react';
import type { OptionsNode } from '@eslint-sukka/node';
import type { OptionsLegacy } from '@eslint-sukka/legacy';

type SharedOptions<T = {}> = Omit<T, 'isInEditor'> & {
  enable?: boolean
};

interface ESLineSukkaOptions {
  isInEditor?: boolean,
  ignores?: OptionsIgnores,
  js?: SharedOptions<OptionsJavaScript>,
  ts?: SharedOptions<OptionsTypeScript>,
  react?: SharedOptions<OptionsReact>,
  node?: SharedOptions<OptionsNode>,
  legacy?: SharedOptions<OptionsLegacy>
}

export const sukka = async (options: ESLineSukkaOptions, ...userConfig: FlatESLintConfigItem[]): Promise<FlatESLintConfigItem[]> => {
  const isInEditor = options.isInEditor ?? !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE) && !process.env.CI);

  const configs: FlatESLintConfigItem[][] = [];

  // ignores
  configs.push(ignores(options.ignores));
  // javascript
  if (options.js?.enable ?? true) {
    configs.push(
      (await foxquire<typeof import('@eslint-sukka/js')>('@eslint-sukka/js')).javascript({ ...options.js, isInEditor })
    );
  }
  // typescript
  if (options.ts && (options.ts.enable ?? isPackageExists('typescript'))) {
    configs.push(
      (await foxquire<typeof import('@eslint-sukka/ts')>('@eslint-sukka/ts')).typescript(options.ts)
    );
  }
  // react
  if (options.react?.enable ?? (isPackageExists('react') || isPackageExists('next') || isPackageExists('preact'))) {
    configs.push(
      (await foxquire<typeof import('@eslint-sukka/react')>('@eslint-sukka/react')).react(options.react)
    );
  }
  // node
  if (options.node?.enable ?? false) {
    configs.push(
      (await foxquire<typeof import('@eslint-sukka/node')>('@eslint-sukka/node')).node(options.node)
    );
  }
  // legacy
  if (options.legacy?.enable ?? false) {
    configs.push(
      (await foxquire<typeof import('@eslint-sukka/legacy')>('@eslint-sukka/legacy')).legacy(options.legacy)
    );
  }

  configs.push(userConfig);

  return configs.flat();
};
