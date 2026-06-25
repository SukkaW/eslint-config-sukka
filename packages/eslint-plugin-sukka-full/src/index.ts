import { eslint_plugin_sukka } from 'eslint-plugin-sukka';

// @masknet/eslint-plugin
import array$no_unneeded_flat_map from '@masknet/eslint-plugin/rules/array/no-unneeded-flat-map.js';
import browser$prefer_location_assign from '@masknet/eslint-plugin/rules/browser/prefer-location-assign.js';
import jsx$no_template_literal from '@masknet/eslint-plugin/rules/jsx/no-template-literal.js';
import jsx$no_unneeded_nested from '@masknet/eslint-plugin/rules/jsx/no-unneeded-nested.js';
import string$no_locale_case from '@masknet/eslint-plugin/rules/string/no-locale-case.js';
import string$no_simple_template_literal from '@masknet/eslint-plugin/rules/string/no-simple-template-literal.js';
import unicode$no_bidi from '@masknet/eslint-plugin/rules/unicode/no-bidi.js';
import unicode$no_invisible from '@masknet/eslint-plugin/rules/unicode/no-invisible.js';
import no_redundant_variable from '@masknet/eslint-plugin/rules/no-redundant-variable.js';
import no_single_return from '@masknet/eslint-plugin/rules/no-single-return.js';
import prefer_early_return from '@masknet/eslint-plugin/rules/prefer-early-return.js';
import prefer_fetch from '@masknet/eslint-plugin/rules/prefer-fetch.js';
import prefer_timer_id from '@masknet/eslint-plugin/rules/prefer-timer-id.js';

// @masknet/eslint-plugin + type checked
import string$no_unneeded_to_string from '@masknet/eslint-plugin/rules/string/no-unneeded-to-string.js';
import type$no_force_cast_via_top_type from '@masknet/eslint-plugin/rules/type/no-force-cast-via-top-type.js';
import type$no_wrapper_type_reference from '@masknet/eslint-plugin/rules/type/no-wrapper-type-reference.js';
import no_default_error from '@masknet/eslint-plugin/rules/no-default-error.js';

// eslint-plugin-unicorn
// eslint-plugin-unicorn introduces way too many dependencies, let's bundle & tree shake them

// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_nested_ternary from 'eslint-plugin-unicorn/rules/no-nested-ternary.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_event_target from 'eslint-plugin-unicorn/rules/prefer-event-target.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_keyboard_event_key from 'eslint-plugin-unicorn/rules/prefer-keyboard-event-key.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_dom_node_text_content from 'eslint-plugin-unicorn/rules/prefer-dom-node-text-content.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import require_array_join_separator from 'eslint-plugin-unicorn/rules/require-array-join-separator.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_thenable from 'eslint-plugin-unicorn/rules/no-thenable.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_invalid_remove_event_listener from 'eslint-plugin-unicorn/rules/no-invalid-remove-event-listener.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import consistent_function_scoping from 'eslint-plugin-unicorn/rules/consistent-function-scoping.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_new_buffer from 'eslint-plugin-unicorn/rules/no-new-buffer.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_console_spaces from 'eslint-plugin-unicorn/rules/no-console-spaces.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_empty_file from 'eslint-plugin-unicorn/rules/no-empty-file.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_fallback_in_spread from 'eslint-plugin-unicorn/rules/no-useless-fallback-in-spread.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_length_check from 'eslint-plugin-unicorn/rules/no-useless-length-check.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_promise_resolve_reject from 'eslint-plugin-unicorn/rules/no-useless-promise-resolve-reject.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_zero_fractions from 'eslint-plugin-unicorn/rules/no-zero-fractions.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_export_from from 'eslint-plugin-unicorn/rules/prefer-export-from.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_native_coercion_functions from 'eslint-plugin-unicorn/rules/prefer-native-coercion-functions.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_document_cookie from 'eslint-plugin-unicorn/rules/no-document-cookie.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_add_event_listener from 'eslint-plugin-unicorn/rules/prefer-add-event-listener.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_array_index_of from 'eslint-plugin-unicorn/rules/prefer-array-index-of.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_blob_reading_methods from 'eslint-plugin-unicorn/rules/prefer-blob-reading-methods.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_date_now from 'eslint-plugin-unicorn/rules/prefer-date-now.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import dom_node_dataset from 'eslint-plugin-unicorn/rules/dom-node-dataset.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_modern_math_apis from 'eslint-plugin-unicorn/rules/prefer-modern-math-apis.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import number_literal_case from 'eslint-plugin-unicorn/rules/number-literal-case.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_number_properties from 'eslint-plugin-unicorn/rules/prefer-number-properties.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_reflect_apply from 'eslint-plugin-unicorn/rules/prefer-reflect-apply.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_set_size from 'eslint-plugin-unicorn/rules/prefer-set-size.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_string_replace_all from 'eslint-plugin-unicorn/rules/prefer-string-replace-all.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_string_slice from 'eslint-plugin-unicorn/rules/prefer-string-slice.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_string_trim_start_end from 'eslint-plugin-unicorn/rules/prefer-string-trim-start-end.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unreadable_iife from 'eslint-plugin-unicorn/rules/no-unreadable-iife.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import throw_new_error from 'eslint-plugin-unicorn/rules/throw-new-error.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import escape_case from 'eslint-plugin-unicorn/rules/escape-case.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_unicode_code_point_escapes from 'eslint-plugin-unicorn/rules/prefer-unicode-code-point-escapes.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_prototype_methods from 'eslint-plugin-unicorn/rules/prefer-prototype-methods.js';
// import relative_url_style from 'eslint-plugin-unicorn/rules/relative-url-style.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import error_message from 'eslint-plugin-unicorn/rules/error-message.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_instanceof_builtins from 'eslint-plugin-unicorn/rules/no-instanceof-builtins.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_type_error from 'eslint-plugin-unicorn/rules/prefer-type-error.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import consistent_destructuring from 'eslint-plugin-unicorn/rules/consistent-destructuring.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import new_for_builtins from 'eslint-plugin-unicorn/rules/new-for-builtins.js';
// too many false positives
// import no_array_method_this_argument from 'eslint-plugin-unicorn/rules/no-array-method-this-argument.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_single_call from 'eslint-plugin-unicorn/rules/prefer-single-call.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_process_exit from 'eslint-plugin-unicorn/rules/no-process-exit.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_single_promise_in_promise_methods from 'eslint-plugin-unicorn/rules/no-single-promise-in-promise-methods.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_static_only_class from 'eslint-plugin-unicorn/rules/no-static-only-class.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unreadable_array_destructuring from 'eslint-plugin-unicorn/rules/no-unreadable-array-destructuring.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_spread from 'eslint-plugin-unicorn/rules/no-useless-spread.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_switch_case from 'eslint-plugin-unicorn/rules/no-useless-switch-case.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_undefined from 'eslint-plugin-unicorn/rules/no-useless-undefined.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import numeric_separators_style from 'eslint-plugin-unicorn/rules/numeric-separators-style.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_array_find from 'eslint-plugin-unicorn/rules/prefer-array-find.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_array_flat_map from 'eslint-plugin-unicorn/rules/prefer-array-flat-map.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_array_flat from 'eslint-plugin-unicorn/rules/prefer-array-flat.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_array_some from 'eslint-plugin-unicorn/rules/prefer-array-some.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_code_point from 'eslint-plugin-unicorn/rules/prefer-code-point.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_default_parameters from 'eslint-plugin-unicorn/rules/prefer-default-parameters.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_logical_operator_over_ternary from 'eslint-plugin-unicorn/rules/prefer-logical-operator-over-ternary.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_optional_catch_binding from 'eslint-plugin-unicorn/rules/prefer-optional-catch-binding.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_regexp_test from 'eslint-plugin-unicorn/rules/prefer-regexp-test.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_set_has from 'eslint-plugin-unicorn/rules/prefer-set-has.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_string_raw from 'eslint-plugin-unicorn/rules/prefer-string-raw.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_switch from 'eslint-plugin-unicorn/rules/prefer-switch.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import require_number_to_fixed_digits_argument from 'eslint-plugin-unicorn/rules/require-number-to-fixed-digits-argument.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import template_indent from 'eslint-plugin-unicorn/rules/template-indent.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_await_in_promise_methods from 'eslint-plugin-unicorn/rules/no-await-in-promise-methods.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_negation_in_equality_check from 'eslint-plugin-unicorn/rules/no-negation-in-equality-check.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unnecessary_slice_end from 'eslint-plugin-unicorn/rules/no-unnecessary-slice-end.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import catch_error_name from 'eslint-plugin-unicorn/rules/catch-error-name.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import custom_error_definition from 'eslint-plugin-unicorn/rules/custom-error-definition.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_lonely_if from 'eslint-plugin-unicorn/rules/no-lonely-if.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_magic_array_flat_depth from 'eslint-plugin-unicorn/rules/no-magic-array-flat-depth.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_negated_condition from 'eslint-plugin-unicorn/rules/no-negated-condition.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_object_as_default_parameter from 'eslint-plugin-unicorn/rules/no-object-as-default-parameter.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_negative_index from 'eslint-plugin-unicorn/rules/prefer-negative-index.js';
// import prefer_ternary from 'eslint-plugin-unicorn/rules/prefer-ternary.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_node_protocol from 'eslint-plugin-unicorn/rules/prefer-node-protocol.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import consistent_date_clone from 'eslint-plugin-unicorn/rules/consistent-date-clone.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_accessor_recursion from 'eslint-plugin-unicorn/rules/no-accessor-recursion.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_import_meta_properties from 'eslint-plugin-unicorn/rules/prefer-import-meta-properties.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unnecessary_array_flat_depth from 'eslint-plugin-unicorn/rules/no-unnecessary-array-flat-depth.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unnecessary_array_splice_count from 'eslint-plugin-unicorn/rules/no-unnecessary-array-splice-count.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_error_capture_stack_trace from 'eslint-plugin-unicorn/rules/no-useless-error-capture-stack-trace.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_class_fields from 'eslint-plugin-unicorn/rules/prefer-class-fields.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_bigint_literals from 'eslint-plugin-unicorn/rules/prefer-bigint-literals.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_classlist_toggle from 'eslint-plugin-unicorn/rules/prefer-classlist-toggle.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import require_module_attributes from 'eslint-plugin-unicorn/rules/require-module-attributes.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_immediate_mutation from 'eslint-plugin-unicorn/rules/no-immediate-mutation.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_collection_argument from 'eslint-plugin-unicorn/rules/no-useless-collection-argument.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_response_static_json from 'eslint-plugin-unicorn/rules/prefer-response-static-json.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import filename_case from 'eslint-plugin-unicorn/rules/filename-case.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import consistent_template_literal_escape from 'eslint-plugin-unicorn/rules/consistent-template-literal-escape.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_iterator_to_array from 'eslint-plugin-unicorn/rules/no-useless-iterator-to-array.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_simple_condition_first from 'eslint-plugin-unicorn/rules/prefer-simple-condition-first.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import switch_case_break_position from 'eslint-plugin-unicorn/rules/switch-case-break-position.js';

// v65 new rules
// @ts-expect-error - eslint-plugin-unicorn does not have types
import better_dom_traversing from 'eslint-plugin-unicorn/rules/better-dom-traversing.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import consistent_compound_words from 'eslint-plugin-unicorn/rules/consistent-compound-words.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_blob_to_file from 'eslint-plugin-unicorn/rules/no-blob-to-file.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_canvas_to_image from 'eslint-plugin-unicorn/rules/no-canvas-to-image.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_confusing_array_splice from 'eslint-plugin-unicorn/rules/no-confusing-array-splice.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_duplicate_set_values from 'eslint-plugin-unicorn/rules/no-duplicate-set-values.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_incorrect_query_selector from 'eslint-plugin-unicorn/rules/no-incorrect-query-selector.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_invalid_file_input_accept from 'eslint-plugin-unicorn/rules/no-invalid-file-input-accept.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_late_current_target_access from 'eslint-plugin-unicorn/rules/no-late-current-target-access.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unnecessary_nested_ternary from 'eslint-plugin-unicorn/rules/no-unnecessary-nested-ternary.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unused_array_method_return from 'eslint-plugin-unicorn/rules/no-unused-array-method-return.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_array_last_methods from 'eslint-plugin-unicorn/rules/prefer-array-last-methods.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_math_abs from 'eslint-plugin-unicorn/rules/prefer-math-abs.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_split_limit from 'eslint-plugin-unicorn/rules/prefer-split-limit.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_queue_microtask from 'eslint-plugin-unicorn/rules/prefer-queue-microtask.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_string_pad_start_end from 'eslint-plugin-unicorn/rules/prefer-string-pad-start-end.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import require_css_escape from 'eslint-plugin-unicorn/rules/require-css-escape.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import require_passive_events from 'eslint-plugin-unicorn/rules/require-passive-events.js';

// v66 new rules
// @ts-expect-error - eslint-plugin-unicorn does not have types
import class_reference_in_static_methods from 'eslint-plugin-unicorn/rules/class-reference-in-static-methods.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import consistent_optional_chaining from 'eslint-plugin-unicorn/rules/consistent-optional-chaining.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import explicit_timer_delay from 'eslint-plugin-unicorn/rules/explicit-timer-delay.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_confusing_array_with from 'eslint-plugin-unicorn/rules/no-confusing-array-with.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_duplicate_loops from 'eslint-plugin-unicorn/rules/no-duplicate-loops.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_declarations_before_early_exit from 'eslint-plugin-unicorn/rules/no-declarations-before-early-exit.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_optional_chaining_on_undeclared_variable from 'eslint-plugin-unicorn/rules/no-optional-chaining-on-undeclared-variable.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_object_methods_with_collections from 'eslint-plugin-unicorn/rules/no-object-methods-with-collections.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_subtraction_comparison from 'eslint-plugin-unicorn/rules/no-subtraction-comparison.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unnecessary_global_this from 'eslint-plugin-unicorn/rules/no-unnecessary-global-this.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_unreadable_object_destructuring from 'eslint-plugin-unicorn/rules/no-unreadable-object-destructuring.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_else from 'eslint-plugin-unicorn/rules/no-useless-else.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_recursion from 'eslint-plugin-unicorn/rules/no-useless-recursion.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_add_event_listener_options from 'eslint-plugin-unicorn/rules/prefer-add-event-listener-options.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_direct_iteration from 'eslint-plugin-unicorn/rules/prefer-direct-iteration.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_number_is_safe_integer from 'eslint-plugin-unicorn/rules/prefer-number-is-safe-integer.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_object_define_properties from 'eslint-plugin-unicorn/rules/prefer-object-define-properties.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_object_destructuring_defaults from 'eslint-plugin-unicorn/rules/prefer-object-destructuring-defaults.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_single_object_destructuring from 'eslint-plugin-unicorn/rules/prefer-single-object-destructuring.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_smaller_scope from 'eslint-plugin-unicorn/rules/prefer-smaller-scope.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_single_array_predicate from 'eslint-plugin-unicorn/rules/prefer-single-array-predicate.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_url_href from 'eslint-plugin-unicorn/rules/prefer-url-href.js';
// import prefer_type_literal_last from 'eslint-plugin-unicorn/rules/prefer-type-literal-last.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import require_proxy_trap_boolean_return from 'eslint-plugin-unicorn/rules/require-proxy-trap-boolean-return.js';

// @ts-expect-error - eslint-plugin-unicorn does not have types
import logical_assignment_operators from 'eslint-plugin-unicorn/rules/logical-assignment-operators.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_coercion from 'eslint-plugin-unicorn/rules/no-useless-coercion.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_boolean_cast from 'eslint-plugin-unicorn/rules/no-useless-boolean-cast.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_continue from 'eslint-plugin-unicorn/rules/no-useless-continue.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_override from 'eslint-plugin-unicorn/rules/no-useless-override.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_has_check from 'eslint-plugin-unicorn/rules/prefer-has-check.js';

// v68 new rules
// @ts-expect-error - eslint-plugin-unicorn does not have types
import consistent_conditional_object_spread from 'eslint-plugin-unicorn/rules/consistent-conditional-object-spread.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import default_export_style from 'eslint-plugin-unicorn/rules/default-export-style.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_array_concat_in_loop from 'eslint-plugin-unicorn/rules/no-array-concat-in-loop.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_array_front_mutation from 'eslint-plugin-unicorn/rules/no-array-front-mutation.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_array_sort_for_min_max from 'eslint-plugin-unicorn/rules/no-array-sort-for-min-max.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_boolean_sort_comparator from 'eslint-plugin-unicorn/rules/no-boolean-sort-comparator.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_chained_comparison from 'eslint-plugin-unicorn/rules/no-chained-comparison.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_constant_zero_expression from 'eslint-plugin-unicorn/rules/no-constant-zero-expression.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_duplicate_logical_operands from 'eslint-plugin-unicorn/rules/no-duplicate-logical-operands.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_impossible_length_comparison from 'eslint-plugin-unicorn/rules/no-impossible-length-comparison.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_invalid_character_comparison from 'eslint-plugin-unicorn/rules/no-invalid-character-comparison.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_loop_iterable_mutation from 'eslint-plugin-unicorn/rules/no-loop-iterable-mutation.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_selector_as_dom_name from 'eslint-plugin-unicorn/rules/no-selector-as-dom-name.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_compound_assignment from 'eslint-plugin-unicorn/rules/no-useless-compound-assignment.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_delete_check from 'eslint-plugin-unicorn/rules/no-useless-delete-check.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_useless_logical_operand from 'eslint-plugin-unicorn/rules/no-useless-logical-operand.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_boolean_return from 'eslint-plugin-unicorn/rules/prefer-boolean-return.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_flat_math_min_max from 'eslint-plugin-unicorn/rules/prefer-flat-math-min-max.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_hoisting_branch_code from 'eslint-plugin-unicorn/rules/prefer-hoisting-branch-code.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_single_replace from 'eslint-plugin-unicorn/rules/prefer-single-replace.js';

// v69 new rules
// @ts-expect-error - eslint-plugin-unicorn does not have types
import consistent_tuple_labels from 'eslint-plugin-unicorn/rules/consistent-tuple-labels.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_invalid_well_known_symbol_methods from 'eslint-plugin-unicorn/rules/no-invalid-well-known-symbol-methods.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import no_late_event_control from 'eslint-plugin-unicorn/rules/no-late-event-control.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_abort_signal_timeout from 'eslint-plugin-unicorn/rules/prefer-abort-signal-timeout.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_aggregate_error from 'eslint-plugin-unicorn/rules/prefer-aggregate-error.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_observer_apis from 'eslint-plugin-unicorn/rules/prefer-observer-apis.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_set_methods from 'eslint-plugin-unicorn/rules/prefer-set-methods.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_toggle_attribute from 'eslint-plugin-unicorn/rules/prefer-toggle-attribute.js';
// @ts-expect-error - eslint-plugin-unicorn does not have types
import prefer_url_search_parameters from 'eslint-plugin-unicorn/rules/prefer-url-search-parameters.js';

// @ts-expect-error - eslint-plugin-unicorn does not have types
import { toEslintRules as loadUnicorns } from 'eslint-plugin-unicorn/rules/rule/index.js';

import type { Linter } from 'eslint';

const plugin = {
  configs: {
    node: {
      name: '@eslint-sukka/eslint-plugin-sukka-full node preset',
      plugins: {
        get sukka() {
          return plugin;
        }
      },
      rules: {
        'sukka/unicorn/prefer-node-protocol': 'error',
        'sukka/unicorn/prefer-import-meta-properties': 'error',

        'no-process-exit': 'off',
        'sukka/unicorn/no-process-exit': 'warn',

        // disallow use of the Buffer() constructor
        // https://eslint.org/docs/rules/no-buffer-constructor
        // replaced by sukka/unicorn/no-new-buffer
        'no-buffer-constructor': 'off',
        'sukka/unicorn/no-new-buffer': 'error' // ban new Buffer, prefer Buffer.from
      } as Linter.RulesRecord
    },
    comment: {
      name: '@eslint-sukka/eslint-plugin-sukka-full comments preset',
      plugins: {
        get sukka() {
          return plugin;
        }
      },
      rules: {
        'sukka/ban-eslint-disable': ['error', 'allow-with-description']
      } as Linter.RulesRecord
    },
    recommended: {
      ...eslint_plugin_sukka.configs.recommended,
      plugins: {
        get sukka() {
          return plugin;
        }
      },
      rules: {
        ...eslint_plugin_sukka.configs.recommended.rules,
        'sukka/prefer-single-boolean-return': 'off',

        'sukka/array/no-unneeded-flat-map': 'error',
        'sukka/browser/prefer-location-assign': 'warn',
        'sukka/jsx/no-template-literal': 'error',
        'sukka/jsx/no-unneeded-nested': 'error',
        'sukka/string/no-locale-case': 'warn',
        'sukka/string/no-simple-template-literal': 'error',
        'sukka/unicode/no-bidi': 'warn',
        'sukka/unicode/no-invisible': 'warn',

        'sukka/no-redundant-variable': 'error',
        'sukka/no-single-return': 'warn',
        'sukka/prefer-early-return': ['error', { maximumStatements: 16 }],
        'sukka/prefer-fetch': 'error',
        'sukka/prefer-timer-id': 'warn'
      }
    },
    recommended_unicorn: {
      name: '@eslint-sukka/eslint-plugin-sukka-full recommended unicorn preset',
      plugins: {
        get sukka() {
          return plugin;
        }
      },
      rules: {
        'sukka/unicorn/no-lonely-if': 'error',
        'sukka/unicorn/no-negated-condition': 'warn',

        'sukka/unicorn/catch-error-name': ['error', { ignore: [/^(?:e|err|error|\w+Err|\w+Error)[\d_]?$/] }],
        'sukka/unicorn/custom-error-definition': 'error',
        'sukka/unicorn/require-array-join-separator': 'warn',
        'sukka/unicorn/no-thenable': 'error',
        'sukka/unicorn/no-invalid-remove-event-listener': 'error',
        'sukka/unicorn/consistent-function-scoping': 'warn',
        'sukka/unicorn/prefer-event-target': 'warn',
        'sukka/unicorn/prefer-keyboard-event-key': 'warn',
        'sukka/unicorn/prefer-text-content': 'warn',
        'sukka/unicorn/no-console-spaces': 'warn',
        'sukka/unicorn/no-empty-file': 'warn',
        'sukka/unicorn/no-useless-fallback-in-spread': 'warn',
        'sukka/unicorn/no-useless-length-check': 'warn',
        'sukka/unicorn/no-useless-promise-resolve-reject': 'warn',
        'sukka/unicorn/no-zero-fractions': 'warn',
        'sukka/unicorn/prefer-export-from': ['warn', { checkUsedVariables: false }],
        'sukka/unicorn/prefer-native-coercion-functions': 'warn',
        'sukka/unicorn/prefer-negative-index': 'warn',
        'sukka/unicorn/no-document-cookie': 'error',
        'sukka/unicorn/prefer-add-event-listener': 'warn',
        'sukka/unicorn/prefer-array-index-of': 'warn',
        'sukka/unicorn/prefer-blob-reading-methods': 'warn',
        'sukka/unicorn/prefer-date-now': 'warn',
        'sukka/unicorn/dom-node-dataset': 'warn',
        'sukka/unicorn/prefer-modern-math-apis': 'warn',
        'sukka/unicorn/number-literal-case': 'error',
        'sukka/unicorn/prefer-number-properties': ['warn', { checkInfinity: false }],
        'sukka/unicorn/prefer-reflect-apply': 'warn',
        'sukka/unicorn/prefer-set-size': 'warn',
        'sukka/unicorn/prefer-string-replace-all': 'warn',
        'sukka/unicorn/prefer-string-slice': 'warn',
        'sukka/unicorn/prefer-string-trim-start-end': 'warn',
        'sukka/unicorn/no-unreadable-iife': 'warn',
        'sukka/unicorn/throw-new-error': 'warn',
        'sukka/unicorn/escape-case': 'warn',
        'sukka/unicorn/prefer-unicode-code-point-escapes': 'warn',
        'sukka/unicorn/prefer-prototype-methods': 'warn',
        'sukka/unicorn/error-message': 'error',
        'sukka/unicorn/no-instanceof-builtins': ['error', { strategy: 'loose' }],
        'sukka/unicorn/prefer-type-error': 'error',
        'sukka/unicorn/consistent-destructuring': 'warn',
        'sukka/unicorn/new-for-builtins': 'warn',
        'sukka/unicorn/prefer-single-call': 'warn',
        'sukka/unicorn/no-static-only-class': 'warn',
        'sukka/unicorn/no-unreadable-array-destructuring': 'error',
        'sukka/unicorn/no-useless-spread': 'error',
        'sukka/unicorn/no-useless-switch-case': 'warn',
        'sukka/unicorn/no-useless-undefined': ['error', { checkArguments: false }],
        'sukka/unicorn/numeric-separators-style': [
          'warn',
          {
            onlyIfContainsSeparator: false,
            number: { minimumDigits: 7, groupLength: 3 },
            binary: { minimumDigits: 9, groupLength: 4 },
            octal: { minimumDigits: 9, groupLength: 4 },
            hexadecimal: { minimumDigits: 5, groupLength: 2 }
          }
        ],
        'sukka/unicorn/prefer-array-find': 'warn',
        'sukka/unicorn/prefer-array-flat-map': 'warn',
        'sukka/unicorn/prefer-array-flat': 'warn',
        'sukka/unicorn/prefer-array-some': 'warn',
        'sukka/unicorn/prefer-code-point': 'warn',
        'sukka/unicorn/prefer-default-parameters': 'warn',
        'sukka/unicorn/prefer-logical-operator-over-ternary': 'warn',
        'sukka/unicorn/prefer-optional-catch-binding': 'error',
        'sukka/unicorn/prefer-regexp-test': 'warn',
        'sukka/unicorn/prefer-set-has': 'error',
        'sukka/unicorn/prefer-switch': 'warn',
        'sukka/unicorn/require-number-to-fixed-digits-argument': 'warn',
        'sukka/unicorn/prefer-string-raw': 'warn',
        'sukka/unicorn/no-single-promise-in-promise-methods': 'error',
        'sukka/unicorn/no-await-in-promise-methods': 'error',
        'sukka/unicorn/no-magic-array-flat-depth': 'error',
        'sukka/unicorn/no-object-as-default-parameter': 'error',
        'sukka/unicorn/template-indent': [
          'warn',
          {
            tags: [
              'outdent',
              'dedent',
              'gql',
              'sql',
              'html',
              'styled',
              'css'
            ],
            functions: [
              'dedent',
              'stripIndent',
              'strip_indent',
              'stripTags',
              'striptags',
              'strip_tags',
              'stripHtml',
              'stripHTML',
              'strip_html'
            ],
            selectors: [],
            comments: [
              'HTML',
              'html',
              'CSS',
              'css',
              'indent'
            ]
          }
        ],
        'sukka/unicorn/no-negation-in-equality-check': 'error',
        'sukka/unicorn/no-unnecessary-slice-end': 'error',
        'sukka/unicorn/consistent-date-clone': 'error',
        'sukka/unicorn/no-accessor-recursion': 'error',
        'sukka/unicorn/no-unnecessary-array-flat-depth': 'error',
        'sukka/unicorn/no-unnecessary-array-splice-count': 'error',
        'sukka/unicorn/no-useless-error-capture-stack-trace': 'error',
        'sukka/unicorn/prefer-class-fields': 'error',
        'sukka/unicorn/prefer-bigint-literals': 'error',
        'sukka/unicorn/prefer-classlist-toggle': 'warn',
        'sukka/unicorn/require-module-attributes': 'error',
        'sukka/unicorn/no-immediate-mutation': 'error',
        'sukka/unicorn/no-useless-collection-argument': 'error',
        'sukka/unicorn/prefer-response-static-json': 'error',
        'sukka/unicorn/consistent-template-literal-escape': 'error',
        'sukka/unicorn/no-useless-iterator-to-array': 'error',
        'sukka/unicorn/prefer-simple-condition-first': 'error',
        'sukka/unicorn/switch-case-break-position': 'error',

        // v65 new rules
        'sukka/unicorn/better-dom-traversing': 'warn',
        'sukka/unicorn/no-blob-to-file': 'error',
        'sukka/unicorn/no-canvas-to-image': 'warn',
        'sukka/unicorn/no-confusing-array-splice': 'error',
        'sukka/unicorn/no-duplicate-set-values': 'error',
        'sukka/unicorn/no-incorrect-query-selector': 'error',
        'sukka/unicorn/no-invalid-file-input-accept': 'error',
        'sukka/unicorn/no-late-current-target-access': 'error',
        'sukka/unicorn/no-unused-array-method-return': 'error',
        'sukka/unicorn/prefer-array-last-methods': 'warn',
        'sukka/unicorn/prefer-math-abs': 'warn',
        'sukka/unicorn/prefer-split-limit': 'warn',
        'sukka/unicorn/prefer-queue-microtask': 'warn',
        'sukka/unicorn/prefer-string-pad-start-end': 'warn',
        'sukka/unicorn/require-css-escape': 'error',
        'sukka/unicorn/require-passive-events': 'warn',

        // v66 new rules
        'sukka/unicorn/class-reference-in-static-methods': 'warn',
        'sukka/unicorn/consistent-optional-chaining': 'error',
        'sukka/unicorn/explicit-timer-delay': 'warn',
        'sukka/unicorn/no-confusing-array-with': 'error',
        'sukka/unicorn/no-duplicate-loops': 'warn',
        'sukka/unicorn/no-declarations-before-early-exit': 'warn',
        'sukka/unicorn/no-optional-chaining-on-undeclared-variable': 'error',
        'sukka/unicorn/no-object-methods-with-collections': 'error',
        'sukka/unicorn/no-subtraction-comparison': 'warn',
        'sukka/unicorn/no-unnecessary-global-this': 'warn',
        'sukka/unicorn/no-useless-else': 'error',
        'sukka/unicorn/no-useless-recursion': 'error',
        'sukka/unicorn/prefer-add-event-listener-options': 'warn',
        'sukka/unicorn/prefer-direct-iteration': 'warn',
        'sukka/unicorn/prefer-number-is-safe-integer': 'warn',
        'sukka/unicorn/prefer-object-define-properties': 'warn',
        'sukka/unicorn/prefer-object-destructuring-defaults': 'warn',
        'sukka/unicorn/prefer-single-object-destructuring': 'warn',
        'sukka/unicorn/prefer-smaller-scope': 'warn',
        'sukka/unicorn/prefer-single-array-predicate': 'warn',
        'sukka/unicorn/prefer-url-href': 'warn',
        'sukka/unicorn/require-proxy-trap-boolean-return': 'error',

        // v67 new rules
        'sukka/unicorn/logical-assignment-operators': 'error',
        'sukka/unicorn/no-useless-coercion': 'error',
        'sukka/unicorn/no-useless-boolean-cast': 'warn',
        'sukka/unicorn/no-useless-continue': 'error',
        'sukka/unicorn/no-useless-override': 'error',
        'sukka/unicorn/prefer-has-check': 'warn',

        // v68 new rules
        'sukka/unicorn/consistent-conditional-object-spread': 'error',
        'sukka/unicorn/no-boolean-sort-comparator': 'error',
        'sukka/unicorn/no-chained-comparison': 'error',
        'sukka/unicorn/no-constant-zero-expression': 'error',
        'sukka/unicorn/no-duplicate-logical-operands': 'error',
        'sukka/unicorn/no-impossible-length-comparison': 'error',
        'sukka/unicorn/no-invalid-character-comparison': 'error',
        'sukka/unicorn/no-loop-iterable-mutation': 'error',
        'sukka/unicorn/no-selector-as-dom-name': 'error',
        'sukka/unicorn/no-array-concat-in-loop': 'error',
        'sukka/unicorn/no-array-front-mutation': 'warn',
        'sukka/unicorn/no-array-sort-for-min-max': 'warn',
        'sukka/unicorn/no-useless-compound-assignment': 'warn',
        'sukka/unicorn/no-useless-delete-check': 'warn',
        'sukka/unicorn/no-useless-logical-operand': 'error',
        'sukka/unicorn/prefer-boolean-return': 'warn',
        'sukka/unicorn/prefer-flat-math-min-max': 'warn',
        'sukka/unicorn/prefer-hoisting-branch-code': 'warn',
        'sukka/unicorn/prefer-single-replace': 'warn',

        // v69 new rules
        'sukka/unicorn/no-invalid-well-known-symbol-methods': 'error',
        'sukka/unicorn/no-late-event-control': 'error',
        'sukka/unicorn/prefer-abort-signal-timeout': 'warn',
        'sukka/unicorn/prefer-aggregate-error': 'warn',
        'sukka/unicorn/prefer-observer-apis': 'warn',
        'sukka/unicorn/prefer-set-methods': 'warn',
        'sukka/unicorn/prefer-toggle-attribute': 'warn',
        'sukka/unicorn/prefer-url-search-parameters': 'warn'
      } as Linter.RulesRecord
    },
    stylistic_unicorn: {
      name: '@eslint-sukka/eslint-plugin-sukka-full stylistic unicorn preset',
      plugins: {
        get sukka() {
          return plugin;
        }
      },
      rules: {
        'sukka/unicorn/no-nested-ternary': 'warn',
        'sukka/unicorn/filename-case': ['error', {
          cases: {
            kebabCase: true,
            snakeCase: true
          },
          ignore: [
            /fixtures/i,
            /^_/,
            /^\./,
            /rc$/i,
            /\.(md|json|yaml|toml|yml|ini|conf|jsonc|json5)$/i
          ]
        }],
        'sukka/unicorn/no-unnecessary-nested-ternary': 'error',
        'sukka/unicorn/no-unreadable-object-destructuring': 'error',
        'sukka/unicorn/consistent-compound-words': 'warn',
        'sukka/unicorn/default-export-style': 'warn'
      } as Linter.RulesRecord
    },
    recommended_extra_with_typed_lint: {
      ...eslint_plugin_sukka.configs.recommended_extra_with_typed_lint,
      plugins: {
        get sukka() {
          return plugin;
        }
      },
      rules: {
        ...eslint_plugin_sukka.configs.recommended_extra_with_typed_lint.rules,
        'sukka/string/no-unneeded-to-string': 'error',
        'sukka/type/no-force-cast-via-top-type': 'error',
        'sukka/type/no-wrapper-type-reference': 'error',
        'sukka/no-default-error': 'off',

        'sukka/unicorn/consistent-tuple-labels': 'warn'
      }
    },
    recommended_react: {
      ...eslint_plugin_sukka.configs.recommended_react,
      plugins: {
        get sukka() {
          return plugin;
        }
      }
    }
  },
  rules: Object.assign<any, unknown, unknown>(
    eslint_plugin_sukka.rules,
    {
      'array/no-unneeded-flat-map': array$no_unneeded_flat_map,
      'browser/prefer-location-assign': browser$prefer_location_assign,
      'jsx/no-template-literal': jsx$no_template_literal,
      'jsx/no-unneeded-nested': jsx$no_unneeded_nested,
      'string/no-locale-case': string$no_locale_case,
      'string/no-simple-template-literal': string$no_simple_template_literal,
      'unicode/no-bidi': unicode$no_bidi,
      'unicode/no-invisible': unicode$no_invisible,
      'no-redundant-variable': no_redundant_variable,
      'no-single-return': no_single_return,
      'prefer-early-return': prefer_early_return,
      'prefer-fetch': prefer_fetch,
      'prefer-timer-id': prefer_timer_id,
      // require type-check
      'string/no-unneeded-to-string': string$no_unneeded_to_string,
      'type/no-force-cast-via-top-type': type$no_force_cast_via_top_type, // If you have a good reason to do this, please ignore this error and provide a comment about why this is type safe.
      'type/no-wrapper-type-reference': type$no_wrapper_type_reference,
      'no-default-error': no_default_error
    },
    // eslint-plugin-unicorn
    loadUnicorns({
      'unicorn/catch-error-name': catch_error_name,
      'unicorn/custom-error-definition': custom_error_definition,
      'unicorn/no-nested-ternary': no_nested_ternary,
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
      'unicorn/no-document-cookie': no_document_cookie,
      'unicorn/prefer-add-event-listener': prefer_add_event_listener,
      'unicorn/prefer-array-index-of': prefer_array_index_of,
      'unicorn/prefer-blob-reading-methods': prefer_blob_reading_methods,
      'unicorn/prefer-date-now': prefer_date_now,
      'unicorn/dom-node-dataset': dom_node_dataset,
      'unicorn/prefer-modern-math-apis': prefer_modern_math_apis,
      'unicorn/number-literal-case': number_literal_case,
      'unicorn/prefer-number-properties': prefer_number_properties,
      'unicorn/prefer-reflect-apply': prefer_reflect_apply,
      'unicorn/prefer-set-size': prefer_set_size,
      'unicorn/prefer-string-replace-all': prefer_string_replace_all,
      'unicorn/prefer-string-slice': prefer_string_slice,
      'unicorn/prefer-string-trim-start-end': prefer_string_trim_start_end,
      'unicorn/no-unreadable-iife': no_unreadable_iife,
      'unicorn/throw-new-error': throw_new_error,
      'unicorn/escape-case': escape_case,
      'unicorn/prefer-unicode-code-point-escapes': prefer_unicode_code_point_escapes,
      'unicorn/prefer-prototype-methods': prefer_prototype_methods,
      // 'unicorn/relative-url-style': relative_url_style,
      'unicorn/error-message': error_message,
      'unicorn/no-instanceof-builtins': no_instanceof_builtins,
      'unicorn/prefer-type-error': prefer_type_error,
      'unicorn/consistent-destructuring': consistent_destructuring,
      'unicorn/new-for-builtins': new_for_builtins,
      // 'unicorn/no-array-method-this-argument': no_array_method_this_argument,
      'unicorn/prefer-single-call': prefer_single_call,
      'unicorn/no-process-exit': no_process_exit,
      'unicorn/no-static-only-class': no_static_only_class,
      'unicorn/no-unreadable-array-destructuring': no_unreadable_array_destructuring,
      'unicorn/no-useless-spread': no_useless_spread,
      'unicorn/no-useless-switch-case': no_useless_switch_case,
      'unicorn/no-useless-undefined': no_useless_undefined,
      'unicorn/numeric-separators-style': numeric_separators_style,
      'unicorn/prefer-array-find': prefer_array_find,
      'unicorn/prefer-array-flat-map': prefer_array_flat_map,
      'unicorn/prefer-array-flat': prefer_array_flat,
      'unicorn/prefer-array-some': prefer_array_some,
      'unicorn/prefer-code-point': prefer_code_point,
      'unicorn/prefer-default-parameters': prefer_default_parameters,
      'unicorn/prefer-logical-operator-over-ternary': prefer_logical_operator_over_ternary,
      'unicorn/prefer-optional-catch-binding': prefer_optional_catch_binding,
      'unicorn/prefer-regexp-test': prefer_regexp_test,
      'unicorn/prefer-set-has': prefer_set_has,
      'unicorn/prefer-string-raw': prefer_string_raw,
      'unicorn/prefer-switch': prefer_switch,
      'unicorn/require-number-to-fixed-digits-argument': require_number_to_fixed_digits_argument,
      'unicorn/template-indent': template_indent,
      'unicorn/no-single-promise-in-promise-methods': no_single_promise_in_promise_methods,
      'unicorn/no-await-in-promise-methods': no_await_in_promise_methods,
      'unicorn/no-negation-in-equality-check': no_negation_in_equality_check,
      'unicorn/no-unnecessary-slice-end': no_unnecessary_slice_end,
      'unicorn/no-lonely-if': no_lonely_if,
      'unicorn/no-magic-array-flat-depth': no_magic_array_flat_depth,
      'unicorn/no-negated-condition': no_negated_condition,
      'unicorn/no-object-as-default-parameter': no_object_as_default_parameter,
      'unicorn/prefer-negative-index': prefer_negative_index,
      'unicorn/prefer-node-protocol': prefer_node_protocol,
      'unicorn/consistent-date-clone': consistent_date_clone,
      'unicorn/no-accessor-recursion': no_accessor_recursion,
      'unicorn/prefer-import-meta-properties': prefer_import_meta_properties,
      'unicorn/no-unnecessary-array-flat-depth': no_unnecessary_array_flat_depth,
      'unicorn/no-unnecessary-array-splice-count': no_unnecessary_array_splice_count,
      'unicorn/no-useless-error-capture-stack-trace': no_useless_error_capture_stack_trace,
      'unicorn/prefer-class-fields': prefer_class_fields,
      'unicorn/prefer-bigint-literals': prefer_bigint_literals,
      'unicorn/prefer-classlist-toggle': prefer_classlist_toggle,
      'unicorn/require-module-attributes': require_module_attributes,
      'unicorn/no-immediate-mutation': no_immediate_mutation,
      'unicorn/no-useless-collection-argument': no_useless_collection_argument,
      'unicorn/prefer-response-static-json': prefer_response_static_json,
      'unicorn/filename-case': filename_case,
      'unicorn/consistent-template-literal-escape': consistent_template_literal_escape,
      'unicorn/no-useless-iterator-to-array': no_useless_iterator_to_array,
      'unicorn/prefer-simple-condition-first': prefer_simple_condition_first,
      'unicorn/switch-case-break-position': switch_case_break_position,
      // v65 new rules
      'unicorn/better-dom-traversing': better_dom_traversing,
      'unicorn/consistent-compound-words': consistent_compound_words,
      'unicorn/no-blob-to-file': no_blob_to_file,
      'unicorn/no-canvas-to-image': no_canvas_to_image,
      'unicorn/no-confusing-array-splice': no_confusing_array_splice,
      'unicorn/no-duplicate-set-values': no_duplicate_set_values,
      'unicorn/no-incorrect-query-selector': no_incorrect_query_selector,
      'unicorn/no-invalid-file-input-accept': no_invalid_file_input_accept,
      'unicorn/no-late-current-target-access': no_late_current_target_access,
      'unicorn/no-unnecessary-nested-ternary': no_unnecessary_nested_ternary,
      'unicorn/no-unused-array-method-return': no_unused_array_method_return,
      'unicorn/prefer-array-last-methods': prefer_array_last_methods,
      'unicorn/prefer-math-abs': prefer_math_abs,
      'unicorn/prefer-split-limit': prefer_split_limit,
      'unicorn/prefer-queue-microtask': prefer_queue_microtask,
      'unicorn/prefer-string-pad-start-end': prefer_string_pad_start_end,
      'unicorn/require-css-escape': require_css_escape,
      'unicorn/require-passive-events': require_passive_events,
      // v66 new rules
      'unicorn/class-reference-in-static-methods': class_reference_in_static_methods,
      'unicorn/consistent-optional-chaining': consistent_optional_chaining,
      'unicorn/explicit-timer-delay': explicit_timer_delay,
      'unicorn/no-confusing-array-with': no_confusing_array_with,
      'unicorn/no-duplicate-loops': no_duplicate_loops,
      'unicorn/no-declarations-before-early-exit': no_declarations_before_early_exit,
      'unicorn/no-optional-chaining-on-undeclared-variable': no_optional_chaining_on_undeclared_variable,
      'unicorn/no-object-methods-with-collections': no_object_methods_with_collections,
      'unicorn/no-subtraction-comparison': no_subtraction_comparison,
      'unicorn/no-unnecessary-global-this': no_unnecessary_global_this,
      'unicorn/no-unreadable-object-destructuring': no_unreadable_object_destructuring,
      'unicorn/no-useless-else': no_useless_else,
      'unicorn/no-useless-recursion': no_useless_recursion,
      'unicorn/prefer-add-event-listener-options': prefer_add_event_listener_options,
      'unicorn/prefer-direct-iteration': prefer_direct_iteration,
      'unicorn/prefer-number-is-safe-integer': prefer_number_is_safe_integer,
      'unicorn/prefer-object-define-properties': prefer_object_define_properties,
      'unicorn/prefer-object-destructuring-defaults': prefer_object_destructuring_defaults,
      'unicorn/prefer-single-object-destructuring': prefer_single_object_destructuring,
      'unicorn/prefer-smaller-scope': prefer_smaller_scope,
      'unicorn/prefer-single-array-predicate': prefer_single_array_predicate,
      'unicorn/prefer-url-href': prefer_url_href,
      'unicorn/require-proxy-trap-boolean-return': require_proxy_trap_boolean_return,
      // v67 new rules
      'unicorn/logical-assignment-operators': logical_assignment_operators,
      'unicorn/no-useless-coercion': no_useless_coercion,
      'unicorn/no-useless-boolean-cast': no_useless_boolean_cast,
      'unicorn/no-useless-continue': no_useless_continue,
      'unicorn/no-useless-override': no_useless_override,
      'unicorn/prefer-has-check': prefer_has_check,
      // v68 new rules
      'unicorn/consistent-conditional-object-spread': consistent_conditional_object_spread,
      'unicorn/default-export-style': default_export_style,
      'unicorn/no-array-concat-in-loop': no_array_concat_in_loop,
      'unicorn/no-array-front-mutation': no_array_front_mutation,
      'unicorn/no-array-sort-for-min-max': no_array_sort_for_min_max,
      'unicorn/no-boolean-sort-comparator': no_boolean_sort_comparator,
      'unicorn/no-chained-comparison': no_chained_comparison,
      'unicorn/no-constant-zero-expression': no_constant_zero_expression,
      'unicorn/no-duplicate-logical-operands': no_duplicate_logical_operands,
      'unicorn/no-impossible-length-comparison': no_impossible_length_comparison,
      'unicorn/no-invalid-character-comparison': no_invalid_character_comparison,
      'unicorn/no-loop-iterable-mutation': no_loop_iterable_mutation,
      'unicorn/no-selector-as-dom-name': no_selector_as_dom_name,
      'unicorn/no-useless-compound-assignment': no_useless_compound_assignment,
      'unicorn/no-useless-delete-check': no_useless_delete_check,
      'unicorn/no-useless-logical-operand': no_useless_logical_operand,
      'unicorn/prefer-boolean-return': prefer_boolean_return,
      'unicorn/prefer-flat-math-min-max': prefer_flat_math_min_max,
      'unicorn/prefer-hoisting-branch-code': prefer_hoisting_branch_code,
      'unicorn/prefer-single-replace': prefer_single_replace,
      // v69 new rules
      'unicorn/consistent-tuple-labels': consistent_tuple_labels,
      'unicorn/no-invalid-well-known-symbol-methods': no_invalid_well_known_symbol_methods,
      'unicorn/no-late-event-control': no_late_event_control,
      'unicorn/prefer-abort-signal-timeout': prefer_abort_signal_timeout,
      'unicorn/prefer-aggregate-error': prefer_aggregate_error,
      'unicorn/prefer-observer-apis': prefer_observer_apis,
      'unicorn/prefer-set-methods': prefer_set_methods,
      'unicorn/prefer-toggle-attribute': prefer_toggle_attribute,
      'unicorn/prefer-url-search-parameters': prefer_url_search_parameters
    })
  )
} as const;

export default plugin;
