import { constants, memo, globals } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import { eslint_plugin_jsx_a11y_minimal } from '@eslint-sukka/eslint-plugin-react-jsx-a11y';

// @ts-expect-error -- no types
import eslint_plugin_react_hooks from 'eslint-plugin-react-hooks';
// @ts-expect-error -- no types
import eslint_plugin_react_compiler from 'eslint-plugin-react-compiler';
// @ts-expect-error -- no types
import eslint_plugin_react_refresh from 'eslint-plugin-react-refresh';

import eslint_plugin_react_prefer_function_component from 'eslint-plugin-react-prefer-function-component';

import eslint_react from '@eslint-react/eslint-plugin';

import stylisticJsx from '@stylistic/eslint-plugin-jsx';
// @ts-expect-error -- no types
import eslint_plugin_ssr_friendly from 'eslint-plugin-ssr-friendly';

import { fixupPluginRules } from '@eslint/compat';

interface EslintReactAdditionalComponents {
  name: string,
  as: string,
  attributes: Array<{
    name: string,
    as: string,
    defaultValue?: string
  }>
}

export interface OptionsReact {
  /**
   * @default '(useIsomorphicLayoutEffect|useSukkaManyOtherCustomEffectHookExample)'
   */
  additionalHooks?: string,
  additionalHooksWithType?: Record<string, string[]>,

  additionalComponents?: EslintReactAdditionalComponents[],

  /**
   * @default 'error'
   */
  reactCompiler?: 'off' | 'warn' | 'error',

  nextjs?: boolean,
  remix?: boolean,
  reactRefresh?: {
    allowConstantExport?: boolean
  }
}

const memoized_eslint_react = memo(eslint_react, '@eslint-react/eslint-plugin');
const memoized_eslint_plugin_ssr_friendly = memo(fixupPluginRules(eslint_plugin_ssr_friendly), 'eslint-plugin-ssr-friendly');

export function react({
  reactCompiler = 'error',
  additionalHooks = '(useIsomorphicLayoutEffect|useSukkaManyOtherCustomEffectHookExample)',
  nextjs = false,
  remix = false,
  reactRefresh = {},
  additionalHooksWithType = {
    useLayoutEffect: ['useIsomorphicLayoutEffect'],
    useEffect: ['useAbortableEffect']
  },
  additionalComponents = [
    {
      name: 'Link',
      as: 'a',
      attributes: [
        { name: 'to', as: 'href' },
        { name: 'rel', as: 'rel' /* defaultValue: 'noopener noreferrer' */ }
      ]
    }
  ]
}: OptionsReact = {}): FlatESLintConfigItem[] {
  const {
    allowConstantExport = false
  } = reactRefresh;

  return [{
    name: '@eslint-sukka/react base',
    files: [
      constants.GLOB_TS,
      constants.GLOB_TSX,
      // constants.GLOB_JS,
      constants.GLOB_JSX
    ],
    plugins: {
      'jsx-a11y-minimal': memo(eslint_plugin_jsx_a11y_minimal, '@eslint-sukka/eslint-plugin-react-jsx-a11y#eslint_plugin_jsx_a11y_minimal'),
      'react-hooks': memo(eslint_plugin_react_hooks, 'eslint-plugin-react-hooks'),
      '@stylistic/jsx': memo(stylisticJsx, '@stylistic/eslint-plugin-jsx'),
      'react-prefer-function-component': memo(eslint_plugin_react_prefer_function_component, 'eslint-plugin-react-prefer-function-component'),
      'react-compiler': memo(eslint_plugin_react_compiler, 'eslint-plugin-react-compiler'),
      ...memoized_eslint_react.configs.recommended.plugins as any,
      'ssr-friendly': memoized_eslint_plugin_ssr_friendly,
      'react-refresh': eslint_plugin_react_refresh
    },
    settings: {
      'react-x': {
        version: 'detect',
        additionalHooks: additionalHooksWithType,
        additionalComponents
      }
    },
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      // plugin:react-hooks/recommended
      ...eslint_plugin_react_hooks.configs.recommended.rules,
      // react compiler rule
      'react-compiler/react-compiler': reactCompiler,

      'react-hooks/exhaustive-deps': ['error', { additionalHooks }],

      // Enforce PascalCase for user-defined JSX components
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
      '@stylistic/jsx/jsx-pascal-case': ['error', {
        allowAllCaps: true,
        ignore: []
      }],
      // Enforce component methods order
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/sort-comp.md
      // 'react-minimal/sort-comp': ['error', {
      //   order: [
      //     'static-variables',
      //     'static-methods',
      //     'instance-variables',
      //     'lifecycle',
      //     '/^handle.+$/',
      //     '/^on.+$/',
      //     'getters',
      //     'setters',
      //     '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
      //     'instance-methods',
      //     'everything-else',
      //     'rendering'
      //   ],
      //   groups: {
      //     lifecycle: [
      //       'displayName',
      //       'propTypes',
      //       'contextTypes',
      //       'childContextTypes',
      //       'mixins',
      //       'statics',
      //       'defaultProps',
      //       'constructor',
      //       'getDefaultProps',
      //       'getInitialState',
      //       'state',
      //       'getChildContext',
      //       'getDerivedStateFromProps',
      //       'componentWillMount',
      //       'UNSAFE_componentWillMount',
      //       'componentDidMount',
      //       'componentWillReceiveProps',
      //       'UNSAFE_componentWillReceiveProps',
      //       'shouldComponentUpdate',
      //       'componentWillUpdate',
      //       'UNSAFE_componentWillUpdate',
      //       'getSnapshotBeforeUpdate',
      //       'componentDidUpdate',
      //       'componentDidCatch',
      //       'componentWillUnmount'
      //     ],
      //     rendering: [
      //       '/^render.+$/',
      //       'render'
      //     ]
      //   }
      // }],

      // ====================================================================

      ...memoized_eslint_react.configs.recommended.rules,
      // eslint-plugin-react recommended rules, migrated
      '@eslint-react/no-string-refs': 'error',
      '@eslint-react/no-comment-textnodes': 'error',
      '@eslint-react/dom/no-unsafe-target-blank': 'error',
      '@eslint-react/no-children-prop': 'error',
      '@eslint-react/dom/no-dangerously-set-innerhtml-with-children': 'error',
      '@eslint-react/dom/no-render-return-value': 'error',
      '@eslint-react/no-direct-mutation-state': 'error',
      '@eslint-react/dom/no-find-dom-node': 'error',
      '@eslint-react/no-unsafe-component-will-mount': 'warn',
      '@eslint-react/no-unsafe-component-will-receive-props': 'warn',
      '@eslint-react/no-unsafe-component-will-update': 'warn',

      // Prevent unused state values
      // https://github.com/jsx-eslint/eslint-plugin-react/pull/1103/
      '@eslint-react/no-unused-state': 'error',
      // Prevent using this.state within a this.setState
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/no-access-state-in-setstate.md
      '@eslint-react/no-access-state-in-setstate': 'error',
      // Prevent usage of any `javascript:` URLs
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md
      '@eslint-react/dom/no-script-url': 'error',

      // Prevent declaring unused methods of component class
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/21e01b61af7a38fc86d94f27eb66cda8054582ed/docs/rules/no-unused-class-component-methods.md
      '@eslint-react/no-unused-class-component-members': 'error',

      // plugin:react/jsx-runtime
      // Manually includes rules
      // ...(eslint_plugin_react.configs!['jsx-runtime'] as Record<string, ESLint.ConfigData>).rules,
      // 'react/react-in-jsx-scope': 'off',
      // 'react/jsx-uses-react': 'off',

      // Unused rules, covered by TypeScript
      // 'react/prop-types': 'off',
      // 'react/display-name': ['off', { ignoreTranspilerName: false }],
      // 'react/no-unknown-property': 'off', // ['error', { ignore: ['css', 'jsx'] }], // covered by TypeScript
      // 'react/jsx-uses-vars': 'off', // covered by TypeScript
      // 'react/jsx-no-duplicate-props': 'off', // covered by TypeScript
      // 'react/jsx-no-undef': 'off', // covered by TypeScript
      // 'react/no-unescaped-entities': 'off',
      // Require render() methods to return something
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
      // 'react/require-render-return': 'off',
      // Require style prop value be an object or var
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
      // 'react/style-prop-object': 'off',

      // Other rules
      '@eslint-react/naming-convention/component-name': ['error', { rule: 'PascalCase' }],
      '@eslint-react/naming-convention/filename': ['error', { rule: 'kebab-case' }],
      '@eslint-react/naming-convention/filename-extension': ['error', { allow: 'as-needed' }],

      // Ensure destructuring and symmetric naming of useState hook value and setter variables
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/c8833f301314dab3e79ef7ac4cf863e4d5fa0019/docs/rules/hook-use-state.md
      // Disable for now, fxxking way too many false positives, re-implement it in eslint-react
      // 'react/hook-use-state': 'off',
      '@eslint-react/naming-convention/use-state': 'error',

      // Require stateless functions when not using lifecycle methods, setState or ref
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
      // Replaced by eslint-plugin-react-prefer-function-component
      // 'react/prefer-stateless-function': 'off',
      'react-prefer-function-component/react-prefer-function-component': 'error',

      // Prevent extra closing tags for components without children
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
      // 'react/self-closing-comp': 'off',
      '@stylistic/jsx/jsx-self-closing-comp': 'error',

      // Enforce boolean attributes notation in JSX
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
      // 'react/jsx-boolean-value': 'off',
      '@eslint-react/prefer-shorthand-boolean': 'error',

      // Enforce or disallow spaces inside of curly braces in JSX attributes
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
      '@stylistic/jsx/jsx-curly-spacing': ['error', 'never', { allowMultiline: true }],
      // Enforce event handler naming conventions in JSX
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
      // 'react/jsx-handler-names': ['off', {
      //  eventHandlerPrefix: 'handle',
      //  eventHandlerPropPrefix: 'on'
      // }],
      // Validate props indentation in JSX
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
      '@stylistic/jsx/jsx-indent-props': ['error', 2],
      // Limit maximum of props on a single line in JSX
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
      '@stylistic/jsx/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],

      // Prevent missing parentheses around multilines JSX
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-wrap-multilines.md
      '@stylistic/jsx/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'ignore',
        logical: 'ignore',
        prop: 'ignore'
      }],
      // Require that the first prop in a JSX element be on a new line when the element is multiline
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
      '@stylistic/jsx/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],

      // https://eslint.style/rules/jsx/jsx-function-call-newline
      '@stylistic/jsx/jsx-function-call-newline': ['error', 'multiline'],
      // Enforce spacing around jsx equals signs
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
      '@stylistic/jsx/jsx-equals-spacing': ['error', 'never'],
      // Enforce JSX indentation
      // https://github.com/eslint-stylistic/eslint-stylistic/pull/413
      // `@stylistic/jsx/jsx-indent` is replaced by `@stylistic/js/indent`
      '@stylistic/jsx/jsx-indent': 'off',

      // https://eslint.style/rules/jsx/jsx-child-element-spacing
      '@stylistic/jsx/jsx-child-element-spacing': 'error',

      // https://eslint.style/rules/jsx/jsx-closing-bracket-location
      '@stylistic/jsx/jsx-closing-bracket-location': ['error', 'line-aligned'],

      // Validate whitespace in and around the JSX opening and closing brackets
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-tag-spacing.md
      '@stylistic/jsx/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never'
      }],

      // Prevent void DOM elements from receiving children
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
      // 'react/void-dom-elements-no-children': 'off',
      '@eslint-react/dom/no-children-in-void-dom-elements': 'error',

      // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
      '@stylistic/jsx/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // Prevent this from being used in stateless functional components
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/no-this-in-sfc.md
      // 'react/no-this-in-sfc': 'off', // covered by typescript

      // Disallow multiple spaces between inline JSX props
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/ac102885765be5ff37847a871f239c6703e1c7cc/docs/rules/jsx-props-no-multi-spaces.md
      '@stylistic/jsx/jsx-props-no-multi-spaces': 'error',

      // Enforce shorthand or standard form for React fragments
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/bc976b837abeab1dffd90ac6168b746a83fc83cc/docs/rules/jsx-fragments.md
      // 'react/jsx-fragments': 'off',
      '@eslint-react/prefer-shorthand-fragment': 'error',

      // Enforce linebreaks in curly braces in JSX attributes and expressions.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
      '@stylistic/jsx/jsx-curly-newline': ['error', {
        multiline: 'consistent',
        singleline: 'consistent'
      }],

      // 'react/jsx-key': 'off', // ['warn', { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true, warnOnDuplicates: true }],
      '@eslint-react/no-missing-key': 'error',
      '@eslint-react/no-array-index-key': 'error',
      '@eslint-react/no-duplicate-key': 'error',
      '@eslint-react/no-implicit-key': 'error',

      // Disallow unnecessary fragments
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
      // 'react/jsx-no-useless-fragment': 'off',
      '@eslint-react/no-useless-fragment': 'error',

      // Prevent react contexts from taking non-stable values
      '@eslint-react/no-unstable-context-value': 'error',

      // Prevent creating uns dable components inside components
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/c2a790a3472eea0f6de984bdc3ee2a62197417fb/docs/rules/no-unstable-nested-components.md
      // 'react/no-unstable-nested-components': 'off',
      '@eslint-react/no-nested-components': 'error',

      // Enforce sandbox attribute on iframe elements
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/c8833f301314dab3e79ef7ac4cf863e4d5fa0019/docs/rules/iframe-missing-sandbox.md
      // 'react/iframe-missing-sandbox': 'off',
      '@eslint-react/dom/no-missing-iframe-sandbox': 'warn',
      '@eslint-react/dom/no-unsafe-iframe-sandbox': 'warn',

      // Prevent problematic leaked values from being rendered
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/c42b624d0fb9ad647583a775ab9751091eec066f/docs/rules/jsx-no-leaked-render.md
      // 'react/jsx-no-leaked-render': 'off',
      '@eslint-react/no-leaked-conditional-rendering': 'error',

      // To prevent potential unnecessary rerenders, and performance regressions
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/66b58dd4864678eb869a7bf434c72ff7ac530eb1/docs/rules/no-object-type-as-default-prop.md
      // 'react/no-object-type-as-default-prop': 'off',
      '@eslint-react/no-unstable-default-props': 'error',

      // default type is "submit" which refresh the page
      // 'react/button-has-type': 'off',
      '@eslint-react/dom/no-missing-button-type': 'error',

      // <svg:rect> react does not support
      // 'react/no-namespace': 'off',
      '@eslint-react/dom/no-namespace': 'error',

      '@typescript-eslint/class-methods-use-this': ['error', {
        exceptMethods: [
          'render',
          'getInitialState',
          'getDefaultProps',
          'getChildContext',
          'componentWillMount',
          'UNSAFE_componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'UNSAFE_componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'UNSAFE_componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
          'componentDidCatch',
          'getSnapshotBeforeUpdate'
        ]
      }],

      'jsx-a11y-minimal/alt-text': [
        'warn',
        {
          elements: ['img'],
          img: ['Image']
        }
      ],
      'jsx-a11y-minimal/aria-props': 'warn',
      'jsx-a11y-minimal/aria-proptypes': 'warn',
      'jsx-a11y-minimal/aria-role': 'warn',
      'jsx-a11y-minimal/aria-unsupported-elements': 'warn',
      'jsx-a11y-minimal/iframe-has-title': 'warn',
      'jsx-a11y-minimal/no-access-key': 'warn',
      'jsx-a11y-minimal/role-has-required-aria-props': 'warn',
      'jsx-a11y-minimal/role-supports-aria-props': 'warn',
      'jsx-a11y-minimal/tabindex-no-positive': 'warn',

      // react refresh
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport,
          allowExportNames: [
            ...(nextjs
              ? [
                'config',
                'generateStaticParams',
                'metadata',
                'generateMetadata',
                'viewport',
                'generateViewport'
              ]
              : []),
            ...(remix
              ? [
                'meta',
                'links',
                'headers',
                'loader',
                'action'
              ]
              : [])
          ]
        }
      ]
    }
  }];
}
