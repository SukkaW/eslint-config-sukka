export const typescript = {
  '@typescript-eslint/ban-ts-comment': [
    'error',
    {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': true,
      'ts-nocheck': true,
      'ts-check': false,
      minimumDescriptionLength: 5
    }
  ], // disable a rule requires a reason
  '@typescript-eslint/naming-convention': [
    'warn',
    {
      selector: 'variable',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
      leadingUnderscore: 'allowSingleOrDouble',
      trailingUnderscore: 'allowSingleOrDouble'
    },
    // Allow camelCase functions (23.2), and PascalCase functions (23.8)
    {
      selector: 'function',
      format: ['camelCase', 'PascalCase'],
      leadingUnderscore: 'allowSingleOrDouble',
      trailingUnderscore: 'allowSingleOrDouble'
    },
    // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
    {
      selector: 'typeLike',
      format: ['PascalCase'],
      leadingUnderscore: 'allowSingleOrDouble',
      trailingUnderscore: 'allowSingleOrDouble'
    }
  ],
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow' }
  ],
  '@typescript-eslint/require-await': 'error',
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-for-in-array': 'error',
  '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true, allowAny: true, allowBoolean: true }],
  '@typescript-eslint/unbound-method': 'error',
  '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports', disallowTypeAnnotations: false, fixStyle: 'separate-type-imports' }],
  '@typescript-eslint/consistent-type-exports': ['warn', { fixMixedExportsWithInlineTypeSpecifier: true }],
  '@typescript-eslint/consistent-type-definitions': 'warn',
  '@typescript-eslint/prefer-ts-expect-error': 'warn',
  '@typescript-eslint/member-delimiter-style': ['error', {
    multiline: { delimiter: 'comma', requireLast: false },
    singleline: { delimiter: 'comma', requireLast: false }
  }],
  '@typescript-eslint/consistent-generic-constructors': ['error', 'constructor'],
  '@typescript-eslint/no-base-to-string': ['error', { ignoredTypeNames: ['Error', 'RegExp', 'URL', 'URLSearchParams'] }],
  '@typescript-eslint/no-confusing-non-null-assertion': 'error', // a! == b
  '@typescript-eslint/no-dynamic-delete': 'warn',
  '@typescript-eslint/no-extraneous-class': ['warn', {
    allowConstructorOnly: true,
    allowEmpty: true,
    allowWithDecorator: true
  }],
  // Promise<void[]> gets flagged
  '@typescript-eslint/no-invalid-void-type': ['off', { allowInGenericTypeArguments: true, allowAsThisParameter: true }],
  '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  // Failed to detect "isCancelled" case in useEffect
  '@typescript-eslint/no-unnecessary-condition': 'warn',
  '@typescript-eslint/no-unnecessary-type-arguments': 'error',
  '@typescript-eslint/no-unsafe-declaration-merging': 'error',
  '@typescript-eslint/no-unsafe-enum-comparison': 'error',
  '@typescript-eslint/non-nullable-type-assertion-style': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
  '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/prefer-return-this-type': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/unified-signatures': ['error', { ignoreDifferentlyNamedParameters: true }],
  '@typescript-eslint/prefer-for-of': 'off',
  '@typescript-eslint/prefer-function-type': 'off',
  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/prefer-enum-initializers': 'warn',
  '@typescript-eslint/no-duplicate-enum-values': 'error',
  '@typescript-eslint/no-extra-non-null-assertion': 'error',
  '@typescript-eslint/no-meaningless-void-operator': 'warn', // void a_void_call()
  '@typescript-eslint/no-unnecessary-qualifier': 'warn', // no extra qualifier in enum/namespace
  '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }], // prefer T[] than Array<T>
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.', allowTypeImports: true },
        { name: 'date-fns/esm', message: 'Please use date-fns/{submodule} instead.' },
        { name: 'idb/with-async-ittr-cjs', message: 'Please use idb/with-async-ittr instead.' },
        { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.', allowTypeImports: true },
        { name: 'lodash-es', message: 'Avoid using type unsafe methods.', importNames: ['get'] }
      ]
    }
  ],

  // the maintainers of @typescript-eslint DOESN'T KNOW ANYTHING about TypeScript AT ALL
  // and basically @typescript-eslint is a joke anyway
  '@typescript-eslint/ban-types': [
    'error',
    {
      types: {
        // {} is widely used with "& {}" approach
        '{}': false,
        FC: {
          message: 'To declare a component, you don\'t have to use FC to annotate it. To type something that accepts/is a React Component, use ComponentType<T>.',
          fixWith: 'ComponentType'
        },
        ReactElement: {
          message: 'In most cases, you want ReactNode. Only ignore this rule when you want to use cloneElement.',
          fixWith: 'ReactNode'
        },
        'React.FC': {
          message: 'To declare a component, you don\'t have to use React.FC to annotate it. To type something that accepts/is a React Component, use React.ComponentType<T>.',
          fixWith: 'React.ComponentType'
        },
        'React.ReactElement': {
          message: 'In most cases, you want React.ReactNode. Only ignore this rule when you want to use cloneElement.',
          fixWith: 'React.ReactNode'
        }
      },
      extendDefaults: true
    }
  ],
  '@typescript-eslint/no-unsafe-assignment': 'off', // bans a = any
  '@typescript-eslint/no-unsafe-argument': 'off', // bans call(any)
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-loop-func': 'warn',
  '@typescript-eslint/no-redundant-type-constituents': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-unsafe-call': 'off', // bans any()
  '@typescript-eslint/no-unsafe-member-access': 'off', // bans a = any.prop
  '@typescript-eslint/no-unsafe-return': 'off' // bans return any
};
