import type { ESLint } from 'eslint';

// TODO: replace w/ eslint-stylistic
// @ts-expect-error -- missing types
import jsx_pascal_case from 'eslint-plugin-react/lib/rules/jsx-pascal-case';
// import sort_comp from 'eslint-plugin-react/lib/rules/sort-comp';

// @ts-expect-error -- missing types
import alt_text from 'eslint-plugin-jsx-a11y/lib/rules/alt-text';
// @ts-expect-error -- missing types
import aria_props from 'eslint-plugin-jsx-a11y/lib/rules/aria-props';
// @ts-expect-error -- missing types
import aria_proptypes from 'eslint-plugin-jsx-a11y/lib/rules/aria-proptypes';
// @ts-expect-error -- missing types
import aria_unsupported_elements from 'eslint-plugin-jsx-a11y/lib/rules/aria-unsupported-elements';
// @ts-expect-error -- missing types
import role_has_required_aria_props from 'eslint-plugin-jsx-a11y/lib/rules/role-has-required-aria-props';
// @ts-expect-error -- missing types
import role_supports_aria_props from 'eslint-plugin-jsx-a11y/lib/rules/role-supports-aria-props';

export const eslint_plugin_react_minimal: ESLint.Plugin = {
  rules: {
    'jsx-pascal-case': jsx_pascal_case
    // 'sort-comp': sort_comp
  }
};

export const eslint_plugin_jsx_a11y_minimal: ESLint.Plugin = {
  rules: {
    'alt-text': alt_text,
    'aria-props': aria_props,
    'aria-proptypes': aria_proptypes,
    'aria-unsupported-elements': aria_unsupported_elements,
    'role-has-required-aria-props': role_has_required_aria_props,
    'role-supports-aria-props': role_supports_aria_props
  }
};
