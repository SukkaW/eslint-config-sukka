// @masknet/eslint-plugin
import array$no_unneeded_flat_map from '@masknet/eslint-plugin/rules/array/no-unneeded-flat-map.js';
import browser$prefer_location_assign from '@masknet/eslint-plugin/rules/browser/prefer-location-assign.js';
import jsx$no_template_literal from '@masknet/eslint-plugin/rules/jsx/no-template-literal.js';
import jsx$no_unneeded_nested from '@masknet/eslint-plugin/rules/jsx/no-unneeded-nested.js';
import string$no_locale_case from '@masknet/eslint-plugin/rules/string/no-locale-case.js';
import string$no_simple_template_literal from '@masknet/eslint-plugin/rules/string/no-simple-template-literal.js';
import type$no_instanceof_wrapper from '@masknet/eslint-plugin/rules/type/no-instanceof-wrapper.js';
import unicode$no_bidi from '@masknet/eslint-plugin/rules/unicode/no-bidi.js';
import unicode$no_invisible from '@masknet/eslint-plugin/rules/unicode/no-invisible.js';
import no_redundant_variable from '@masknet/eslint-plugin/rules/no-redundant-variable.js';
import no_single_return from '@masknet/eslint-plugin/rules/no-single-return.js';
import prefer_early_return from '@masknet/eslint-plugin/rules/prefer-early-return.js';
import prefer_fetch from '@masknet/eslint-plugin/rules/prefer-fetch.js';
import prefer_timer_id from '@masknet/eslint-plugin/rules/prefer-timer-id.js';
import string$no_unneeded_to_string from '@masknet/eslint-plugin/rules/string/no-unneeded-to-string.js';
import type$no_force_cast_via_top_type from '@masknet/eslint-plugin/rules/type/no-force-cast-via-top-type.js';
import type$no_wrapper_type_reference from '@masknet/eslint-plugin/rules/type/no-wrapper-type-reference.js';
import no_default_error from '@masknet/eslint-plugin/rules/no-default-error.js';

// eslint-plugin-unicorn
// @ts-expect-error -- no types
import prefer_event_target from 'eslint-plugin-unicorn/rules/prefer-event-target.js';
// @ts-expect-error -- no types
import prefer_keyboard_event_key from 'eslint-plugin-unicorn/rules/prefer-keyboard-event-key.js';
// @ts-expect-error -- no types
import prefer_dom_node_text_content from 'eslint-plugin-unicorn/rules/prefer-dom-node-text-content.js';
// @ts-expect-error -- no types
import require_array_join_separator from 'eslint-plugin-unicorn/rules/require-array-join-separator.js';
// @ts-expect-error -- no types
import no_thenable from 'eslint-plugin-unicorn/rules/no-thenable.js';
// @ts-expect-error -- no types
import no_invalid_remove_event_listener from 'eslint-plugin-unicorn/rules/no-invalid-remove-event-listener.js';
// @ts-expect-error -- no types
import consistent_function_scoping from 'eslint-plugin-unicorn/rules/consistent-function-scoping.js';
// @ts-expect-error -- no new buffer
import no_new_buffer from 'eslint-plugin-unicorn/rules/no-new-buffer.js';
// @ts-expect-error -- no types
import no_console_spaces from 'eslint-plugin-unicorn/rules/no-console-spaces.js';
// @ts-expect-error -- no types
import no_empty_file from 'eslint-plugin-unicorn/rules/no-empty-file.js';
// @ts-expect-error -- no types
import no_useless_fallback_in_spread from 'eslint-plugin-unicorn/rules/no-useless-fallback-in-spread.js';
// @ts-expect-error -- no types
import no_useless_length_check from 'eslint-plugin-unicorn/rules/no-useless-length-check.js';
// @ts-expect-error -- no types
import no_useless_promise_resolve_reject from 'eslint-plugin-unicorn/rules/no-useless-promise-resolve-reject.js';
// @ts-expect-error -- no types
import no_zero_fractions from 'eslint-plugin-unicorn/rules/no-zero-fractions.js';
// @ts-expect-error -- no types
import prefer_export_from from 'eslint-plugin-unicorn/rules/prefer-export-from.js';
// @ts-expect-error -- no types
import prefer_native_coercion_functions from 'eslint-plugin-unicorn/rules/prefer-native-coercion-functions.js';

// eslint-plugin-sukka
import ban_eslint_disable from './rules/ban-eslint-disable';

export default {
  rules: {
    'array/no-unneeded-flat-map': array$no_unneeded_flat_map,
    'browser/prefer-location-assign': browser$prefer_location_assign,
    'jsx/no-template-literal': jsx$no_template_literal,
    'jsx/no-unneeded-nested': jsx$no_unneeded_nested,
    'string/no-locale-case': string$no_locale_case,
    'string/no-simple-template-literal': string$no_simple_template_literal,
    'type/no-instanceof-wrapper': type$no_instanceof_wrapper,
    'unicode/no-bidi': unicode$no_bidi,
    'unicode/no-invisible': unicode$no_invisible,
    'ban-eslint-disable': ban_eslint_disable,
    'no-redundant-variable': no_redundant_variable,
    'no-single-return': no_single_return,
    'prefer-early-return': prefer_early_return,
    'prefer-fetch': prefer_fetch,
    'prefer-timer-id': prefer_timer_id,

    'unicorn/prefer-event-target': prefer_event_target,
    'unicorn/prefer-keyboard-event-key': prefer_keyboard_event_key,
    'unicorn/prefer-text-content': prefer_dom_node_text_content,
    'unicorn/require-array-join-separator': require_array_join_separator,
    'unicorn/no-thenable': no_thenable,
    'unicorn/no-invalid-remove-event-listener': no_invalid_remove_event_listener,
    'unicorn/consistent-function-scoping': consistent_function_scoping,
    'unicorn/no-new-buffer': no_new_buffer,
    'unicorn/no-console-spaces': no_console_spaces,
    'unicorn/no-empty-file': no_empty_file,
    'unicorn/no-useless-fallback-in-spread': no_useless_fallback_in_spread,
    'unicorn/no-useless-length-check': no_useless_length_check,
    'unicorn/no-useless-promise-resolve-reject': no_useless_promise_resolve_reject,
    'unicorn/no-zero-fractions': no_zero_fractions,
    'unicorn/prefer-export-from': prefer_export_from,
    'unicorn/prefer-native-coercion-functions': prefer_native_coercion_functions,

    // Require TS
    'string/no-unneeded-to-string': string$no_unneeded_to_string,
    // If you have a good reason to do this, please ignore this error and provide a comment about why this is type safe.
    'type/no-force-cast-via-top-type': type$no_force_cast_via_top_type,
    'type/no-wrapper-type-reference': type$no_wrapper_type_reference,
    'no-default-error': no_default_error
  }
};
