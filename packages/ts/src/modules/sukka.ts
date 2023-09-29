import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';

import eslint_plugin_sukka_ts from 'eslint-plugin-sukka-ts';
import ts_eslint_plugin from '@typescript-eslint/eslint-plugin';
// @ts-expect-error -- no types
import eslint_plugin_antfu from 'eslint-plugin-antfu';

export const sukka_typeScript: SukkaESLintRuleConfig = {
  plugins: {
    'sukka-ts': eslint_plugin_sukka_ts,
    '@typescript-eslint': ts_eslint_plugin as any,
    antfu: eslint_plugin_antfu
  },
  rules: {
    '@typescript-eslint/no-namespace': 'off',

    // prefer string.startsWith() and string.endsWith() over more complex alternatives
    // but also allow a[0] === 'a'
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',
    'sukka-ts/string/prefer-string-starts-ends-with': 'error',

    'sukka-ts/string/no-unneeded-to-string': 'error',
    // If you have a good reason to do this, please ignore this error and provide a comment about why this is type safe.
    'sukka-ts/type/no-force-cast-via-top-type': 'error',
    'sukka-ts/type/no-wrapper-type-reference': 'error',
    'sukka-ts/no-default-error': 'off', // disable since this is way too slow

    'antfu/generic-spacing': 'error',
    'antfu/named-tuple-spacing': 'error',
    'antfu/no-const-enum': 'error' // not tree-shakable by swc/babel/esbuild
  }
};
