import type { ESLint } from 'eslint';
// @ts-expect-error -- missing types
import * as $eslint_plugin_react from 'eslint-plugin-react';
// @ts-expect-error -- missing types
import * as $eslint_plugin_jsx_a11y from 'eslint-plugin-jsx-a11y';

export const eslint_plugin_react: ESLint.Plugin = $eslint_plugin_react;
export const eslint_plugin_jsx_a11y: ESLint.Plugin = $eslint_plugin_jsx_a11y;
