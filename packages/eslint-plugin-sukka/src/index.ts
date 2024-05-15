// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- eslint-plugin-unicorn has no types at all
// @ts-nocheck

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

// eslint-plugin-unicorn
// eslint-plugin-unicorn introduces way too many dependencies, let's bundle & tree shake them
import getDocumentationUrl from 'eslint-plugin-unicorn/rules/utils/get-documentation-url.js';

import no_nested_ternary from 'eslint-plugin-unicorn/rules/no-nested-ternary.js';
import prefer_event_target from 'eslint-plugin-unicorn/rules/prefer-event-target.js';
import prefer_keyboard_event_key from 'eslint-plugin-unicorn/rules/prefer-keyboard-event-key.js';
import prefer_dom_node_text_content from 'eslint-plugin-unicorn/rules/prefer-dom-node-text-content.js';
import require_array_join_separator from 'eslint-plugin-unicorn/rules/require-array-join-separator.js';
import no_thenable from 'eslint-plugin-unicorn/rules/no-thenable.js';
import no_invalid_remove_event_listener from 'eslint-plugin-unicorn/rules/no-invalid-remove-event-listener.js';
import consistent_function_scoping from 'eslint-plugin-unicorn/rules/consistent-function-scoping.js';
import no_new_buffer from 'eslint-plugin-unicorn/rules/no-new-buffer.js';
import no_console_spaces from 'eslint-plugin-unicorn/rules/no-console-spaces.js';
import no_empty_file from 'eslint-plugin-unicorn/rules/no-empty-file.js';
import no_useless_fallback_in_spread from 'eslint-plugin-unicorn/rules/no-useless-fallback-in-spread.js';
import no_useless_length_check from 'eslint-plugin-unicorn/rules/no-useless-length-check.js';
import no_useless_promise_resolve_reject from 'eslint-plugin-unicorn/rules/no-useless-promise-resolve-reject.js';
import no_zero_fractions from 'eslint-plugin-unicorn/rules/no-zero-fractions.js';
import prefer_export_from from 'eslint-plugin-unicorn/rules/prefer-export-from.js';
import prefer_native_coercion_functions from 'eslint-plugin-unicorn/rules/prefer-native-coercion-functions.js';
import no_document_cookie from 'eslint-plugin-unicorn/rules/no-document-cookie.js';
import prefer_add_event_listener from 'eslint-plugin-unicorn/rules/prefer-add-event-listener.js';
import prefer_array_index_of from 'eslint-plugin-unicorn/rules/prefer-array-index-of.js';
import prefer_blob_reading_methods from 'eslint-plugin-unicorn/rules/prefer-blob-reading-methods.js';
import prefer_date_now from 'eslint-plugin-unicorn/rules/prefer-date-now.js';
import prefer_dom_node_dataset from 'eslint-plugin-unicorn/rules/prefer-dom-node-dataset.js';
import prefer_modern_math_apis from 'eslint-plugin-unicorn/rules/prefer-modern-math-apis.js';
import number_literal_case from 'eslint-plugin-unicorn/rules/number-literal-case.js';
import prefer_number_properties from 'eslint-plugin-unicorn/rules/prefer-number-properties.js';
import prefer_reflect_apply from 'eslint-plugin-unicorn/rules/prefer-reflect-apply.js';
import prefer_set_size from 'eslint-plugin-unicorn/rules/prefer-set-size.js';
import prefer_string_replace_all from 'eslint-plugin-unicorn/rules/prefer-string-replace-all.js';
import prefer_string_slice from 'eslint-plugin-unicorn/rules/prefer-string-slice.js';
import prefer_string_trim_start_end from 'eslint-plugin-unicorn/rules/prefer-string-trim-start-end.js';
import no_unreadable_iife from 'eslint-plugin-unicorn/rules/no-unreadable-iife.js';
import throw_new_error from 'eslint-plugin-unicorn/rules/throw-new-error.js';
import better_regex from 'eslint-plugin-unicorn/rules/better-regex.js';
import escape_case from 'eslint-plugin-unicorn/rules/escape-case.js';
import no_hex_escape from 'eslint-plugin-unicorn/rules/no-hex-escape.js';
import prefer_prototype_methods from 'eslint-plugin-unicorn/rules/prefer-prototype-methods.js';
// import relative_url_style from 'eslint-plugin-unicorn/rules/relative-url-style.js';
import error_message from 'eslint-plugin-unicorn/rules/error-message.js';
import no_instanceof_array from 'eslint-plugin-unicorn/rules/no-instanceof-array.js';
import prefer_type_error from 'eslint-plugin-unicorn/rules/prefer-type-error.js';
import consistent_destructuring from 'eslint-plugin-unicorn/rules/consistent-destructuring.js';
import new_for_builtins from 'eslint-plugin-unicorn/rules/new-for-builtins.js';
// import no_array_method_this_argument from 'eslint-plugin-unicorn/rules/no-array-method-this-argument.js';
import no_array_push_push from 'eslint-plugin-unicorn/rules/no-array-push-push.js';
import no_process_exit from 'eslint-plugin-unicorn/rules/no-process-exit.js';
import no_single_promise_in_promise_methods from 'eslint-plugin-unicorn/rules/no-single-promise-in-promise-methods.js';
import no_static_only_class from 'eslint-plugin-unicorn/rules/no-static-only-class.js';
import no_unreadable_array_destructuring from 'eslint-plugin-unicorn/rules/no-unreadable-array-destructuring.js';
import no_useless_spread from 'eslint-plugin-unicorn/rules/no-useless-spread.js';
import no_useless_switch_case from 'eslint-plugin-unicorn/rules/no-useless-switch-case.js';
import no_useless_undefined from 'eslint-plugin-unicorn/rules/no-useless-undefined.js';
import numeric_separators_style from 'eslint-plugin-unicorn/rules/numeric-separators-style.js';
import prefer_array_find from 'eslint-plugin-unicorn/rules/prefer-array-find.js';
import prefer_array_flat_map from 'eslint-plugin-unicorn/rules/prefer-array-flat-map.js';
import prefer_array_flat from 'eslint-plugin-unicorn/rules/prefer-array-flat.js';
import prefer_array_some from 'eslint-plugin-unicorn/rules/prefer-array-some.js';
import prefer_code_point from 'eslint-plugin-unicorn/rules/prefer-code-point.js';
import prefer_default_parameters from 'eslint-plugin-unicorn/rules/prefer-default-parameters.js';
import prefer_logical_operator_over_ternary from 'eslint-plugin-unicorn/rules/prefer-logical-operator-over-ternary.js';
import prefer_optional_catch_binding from 'eslint-plugin-unicorn/rules/prefer-optional-catch-binding.js';
import prefer_regexp_test from 'eslint-plugin-unicorn/rules/prefer-regexp-test.js';
import prefer_set_has from 'eslint-plugin-unicorn/rules/prefer-set-has.js';
import prefer_string_raw from 'eslint-plugin-unicorn/rules/prefer-string-raw.js';
import prefer_switch from 'eslint-plugin-unicorn/rules/prefer-switch.js';
import require_number_to_fixed_digits_argument from 'eslint-plugin-unicorn/rules/require-number-to-fixed-digits-argument.js';
import template_indent from 'eslint-plugin-unicorn/rules/template-indent.js';
import no_await_in_promise_methods from 'eslint-plugin-unicorn/rules/no-await-in-promise-methods.js';

// eslint-plugin-sukka
import ban_eslint_disable from './rules/ban-eslint-disable';
import import_dedupe from './rules/import-dedupe';

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
    'import-dedupe': import_dedupe,

    // eslint-plugin-unicorn
    ...Object.fromEntries(
      Object.entries({
        'unicorn/better-regex': better_regex,
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
        'unicorn/prefer-dom-node-dataset': prefer_dom_node_dataset,
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
        'unicorn/no-hex-escape': no_hex_escape,
        'unicorn/prefer-prototype-methods': prefer_prototype_methods,
        // 'unicorn/relative-url-style': relative_url_style,
        'unicorn/error-message': error_message,
        'unicorn/no-instanceof-array': no_instanceof_array,
        'unicorn/prefer-type-error': prefer_type_error,
        'unicorn/consistent-destructuring': consistent_destructuring,
        'unicorn/new-for-builtins': new_for_builtins,
        // 'unicorn/no-array-method-this-argument': no_array_method_this_argument,
        'unicorn/no-array-push-push': no_array_push_push,
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
        'unicorn/prefer-prototype-methods': prefer_prototype_methods,
        'unicorn/prefer-regexp-test': prefer_regexp_test,
        'unicorn/prefer-set-has': prefer_set_has,
        'unicorn/prefer-string-raw': prefer_string_raw,
        'unicorn/prefer-switch': prefer_switch,
        'unicorn/require-number-to-fixed-digits-argument': require_number_to_fixed_digits_argument,
        'unicorn/template-indent': template_indent,
        'unicorn/no-single-promise-in-promise-methods': no_single_promise_in_promise_methods,
        'unicorn/no-await-in-promise-methods': no_await_in_promise_methods
      }).map(([ruleId, rule]) => [ruleId, loadUnicorn(rule, ruleId)])
    )
  }
};

function loadUnicorn(rule: any, ruleId: string): import('eslint').Rule.RuleModule {
  return {
    meta: {
      // If there is are, options add `[]` so ESLint can validate that no data is passed to the rule.
      // https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/blob/master/docs/rules/require-meta-schema.md
      schema: [],
      ...rule.meta,
      docs: {
        ...rule.meta.docs,
        url: getDocumentationUrl(ruleId)
      }
    },
    create: reportProblems(rule.create)
  };
}

const isIterable = object => typeof object?.[Symbol.iterator] === 'function';

class FixAbortError extends Error { }

const fixOptions = {
  abort() {
    throw new FixAbortError('Fix aborted.');
  }
};

function wrapFixFunction(fix) {
  return fixer => {
    const result = fix(fixer, fixOptions);

    if (isIterable(result)) {
      try {
        return [...result];
      } catch (error) {
        if (error instanceof FixAbortError) {
          return;
        }

        /* c8 ignore next */
        throw error;
      }
    }

    return result;
  };
}

function reportListenerProblems(problems, context) {
  if (!problems) {
    return;
  }

  if (!isIterable(problems)) {
    problems = [problems];
  }

  for (const problem of problems) {
    if (!problem) {
      continue;
    }

    if (problem.fix) {
      problem.fix = wrapFixFunction(problem.fix);
    }

    if (isIterable(problem.suggest)) {
      for (const suggest of problem.suggest) {
        if (suggest.fix) {
          suggest.fix = wrapFixFunction(suggest.fix);
        }

        suggest.data = {
          ...problem.data,
          ...suggest.data
        };
      }
    }

    context.report(problem);
  }
}

// `checkVueTemplate` function will wrap `create` function, there is no need to wrap twice
// const wrappedFunctions = new WeakSet();
function reportProblems(create) {
  // if (wrappedFunctions.has(create)) {
  //   return create;
  // }

  // wrappedFunctions.add(wrapped);

  return context => {
    const listeners = {};
    const addListener = (selector, listener) => {
      listeners[selector] ??= [];
      listeners[selector].push(listener);
    };

    const contextProxy = new Proxy(context, {
      get(target, property, receiver) {
        if (property === 'on') {
          return (selectorOrSelectors, listener) => {
            const selectors = Array.isArray(selectorOrSelectors) ? selectorOrSelectors : [selectorOrSelectors];
            for (const selector of selectors) {
              addListener(selector, listener);
            }
          };
        }

        if (property === 'onExit') {
          return (selectorOrSelectors, listener) => {
            const selectors = Array.isArray(selectorOrSelectors) ? selectorOrSelectors : [selectorOrSelectors];
            for (const selector of selectors) {
              addListener(`${selector}:exit`, listener);
            }
          };
        }

        return Reflect.get(target, property, receiver);
      }
    });

    for (const [selector, listener] of Object.entries(create(contextProxy) ?? {})) {
      addListener(selector, listener);
    }

    return Object.fromEntries(
      Object.entries(listeners)
        .map(([selector, listeners]) => [
          selector,
          // Listener arguments can be `codePath, node` or `node`
          (...listenerArguments) => {
            for (const listener of listeners) {
              reportListenerProblems(listener(...listenerArguments), context);
            }
          }
        ])
    );
  };
}
