import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import stylex_eslint_plugin from '@stylexjs/eslint-plugin';

export interface OptionsStyleX {
  opt?: StyleXESLintOptions
}

interface StyleXESLintOptions {
  // Possible strings where you can import stylex from
  //
  // Default: ['@stylexjs/stylex']
  validImports?: string[],

  // Custom limits for values of various properties
  propLimits?: PropLimits,

  // @deprecated
  // Allow At Rules and Pseudo Selectors outside of
  // style values.
  //
  // Default: false
  allowOuterPseudoAndMedia?: boolean,

  // @deprecated
  // Disallow properties that are known to break
  // in 'legacy-expand-shorthands' style resolution mode.
  //
  // Default: false
  banPropsForLegacy?: boolean
}

interface PropLimits {
  // The property name as a string or a glob pattern
  [propertyName: string]: {
    limit:
      // Disallow the property
      | null
      // Allow any string value
      | 'string'
      // Allow any number value
      | 'number'
      // Any string other 'string' or 'number'
      // will be considered to be a valid constant
      // e.g. 'red' or '100px'.
      | string
      // You can also provide numeric constants
      // e.g. 100 or 0.5
      | number
      // You can also provide an array of valid
      // number or string constant values.
      | Array<string | number>,
    // The error message to show when a value doesn't
    // conform to the provided restriction.
    reason: string
  }
}

export function stylex({ opt = {} }: OptionsStyleX = {}): FlatESLintConfigItem[] {
  return [{
    plugins: {
      '@stylexjs': stylex_eslint_plugin as any
    },
    files: [
      constants.GLOB_TS,
      constants.GLOB_TSX,
      // constants.GLOB_JS,
      constants.GLOB_JSX
    ],
    rules: {
      '@stylexjs/valid-styles': ['error', opt],
      '@stylexjs/valid-shorthands': ['error', opt]
    }
  }];
}
