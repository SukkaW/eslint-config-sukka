import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';

import eslint_plugin_sukka from 'eslint-plugin-sukka';
import ts_eslint_plugin from '@typescript-eslint/eslint-plugin';
// @ts-expect-error -- no types
import eslint_plugin_antfu from 'eslint-plugin-antfu';

export const sukka_typeScript: SukkaESLintRuleConfig = {
  plugins: {
    sukka: eslint_plugin_sukka,
    '@typescript-eslint': ts_eslint_plugin as any,
    antfu: eslint_plugin_antfu
  },
  rules: {
    '@typescript-eslint/no-namespace': 'off',

    'sukka/string/no-unneeded-to-string': 'error',
    // If you have a good reason to do this, please ignore this error and provide a comment about why this is type safe.
    'sukka/type/no-force-cast-via-top-type': 'error',
    'sukka/type/no-wrapper-type-reference': 'error',
    'sukka/no-default-error': 'off', // disable since this is way too slow

    'antfu/generic-spacing': 'error',
    'antfu/named-tuple-spacing': 'error',
    'antfu/no-const-enum': 'error' // not tree-shakable by swc/babel/esbuild
  }
};
