import type { ESLint } from 'eslint';

// import sort_comp from 'eslint-plugin-react/lib/rules/sort-comp';

// @ts-expect-error -- missing types
import alt_text from 'eslint-plugin-jsx-a11y/lib/rules/alt-text';
// @ts-expect-error -- missing types
import aria_props from 'eslint-plugin-jsx-a11y/lib/rules/aria-props';
// @ts-expect-error -- missing types
import aria_proptypes from 'eslint-plugin-jsx-a11y/lib/rules/aria-proptypes';
// @ts-expect-error -- missing types
import aria_role from 'eslint-plugin-jsx-a11y/lib/rules/aria-role';
// @ts-expect-error -- missing types
import aria_unsupported_elements from 'eslint-plugin-jsx-a11y/lib/rules/aria-unsupported-elements';
// @ts-expect-error -- missing types
import iframe_has_title from 'eslint-plugin-jsx-a11y/lib/rules/iframe-has-title';
// @ts-expect-error -- missing types
import no_access_key from 'eslint-plugin-jsx-a11y/lib/rules/no-access-key';
// @ts-expect-error -- missing types
import role_has_required_aria_props from 'eslint-plugin-jsx-a11y/lib/rules/role-has-required-aria-props';
// @ts-expect-error -- missing types
import role_supports_aria_props from 'eslint-plugin-jsx-a11y/lib/rules/role-supports-aria-props';
// @ts-expect-error -- missing types
import tabindex_no_positive from 'eslint-plugin-jsx-a11y/lib/rules/tabindex-no-positive';

export const eslint_plugin_jsx_a11y_minimal: ESLint.Plugin = {
  rules: {
    'alt-text': alt_text,
    'aria-props': aria_props,
    'aria-proptypes': aria_proptypes,
    'aria-role': aria_role,
    'aria-unsupported-elements': aria_unsupported_elements,
    'iframe-has-title': iframe_has_title,
    'no-access-key': no_access_key,
    'role-has-required-aria-props': role_has_required_aria_props,
    'role-supports-aria-props': role_supports_aria_props,
    'tabindex-no-positive': tabindex_no_positive
  }
};
