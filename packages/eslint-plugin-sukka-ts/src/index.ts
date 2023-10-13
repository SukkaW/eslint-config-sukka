import prefer_string_starts_ends_with from './rules/prefer-string-starts-ends-with';
import no_const_enum from './rules/no-const-enum';

// @masknet/eslint-plugin
import string$no_unneeded_to_string from '@masknet/eslint-plugin/rules/string/no-unneeded-to-string.js';
import type$no_force_cast_via_top_type from '@masknet/eslint-plugin/rules/type/no-force-cast-via-top-type.js';
import type$no_wrapper_type_reference from '@masknet/eslint-plugin/rules/type/no-wrapper-type-reference.js';
import no_default_error from '@masknet/eslint-plugin/rules/no-default-error.js';

export default {
  rules: {
    'string/prefer-string-starts-ends-with': prefer_string_starts_ends_with,

    'string/no-unneeded-to-string': string$no_unneeded_to_string,
    // If you have a good reason to do this, please ignore this error and provide a comment about why this is type safe.
    'type/no-force-cast-via-top-type': type$no_force_cast_via_top_type,
    'type/no-wrapper-type-reference': type$no_wrapper_type_reference,
    'no-default-error': no_default_error,
    'no-const-enum': no_const_enum
  }
};
