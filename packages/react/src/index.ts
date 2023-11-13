import { constants } from '@eslint-sukka/shared';
import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

// @ts-expect-error -- no types
import eslint_plugin_i from 'eslint-plugin-import';
// @ts-expect-error -- no types
import eslint_plugin_react from 'eslint-plugin-react';
// @ts-expect-error -- no types
import eslint_plugin_jsx_a11y from 'eslint-plugin-jsx-a11y';
// @ts-expect-error -- no types
import eslint_plugin_react_hooks from 'eslint-plugin-react-hooks';

import stylisticJsx from '@stylistic/eslint-plugin-jsx';

import globals from 'globals';

export interface OptionsReact {
  /**
   * @default '(useIsomorphicLayoutEffect|useSukkaManyOtherCustomEffectHookExample)'
   */
  additionalHooks?: string
}

const allExtensions = ['.js', '.jsx', '.mjs', '.cjs'];
export const react = (options: OptionsReact = {}): FlatESLintConfigItem[] => {
  return [
    {
      files: [
        constants.GLOB_TS,
        constants.GLOB_TSX,
        constants.GLOB_JS,
        constants.GLOB_JSX
      ],
      plugins: {
        i: eslint_plugin_i,
        import: eslint_plugin_i, // legacy
        react: eslint_plugin_react,
        'jsx-a11y': eslint_plugin_jsx_a11y,
        'react-hooks': eslint_plugin_react_hooks,
        '@stylistic/jsx': stylisticJsx
      },
      settings: {
        'import/extensions': allExtensions,
        'import/parsers': {
          // TODO: remove this line once eslint-plugin-import #2556 is fixed
          espree: allExtensions
        },
        'import/resolver': {
          node: {
            extensions: allExtensions
          }
        },
        react: {
          version: 'detect'
        }
      },
      languageOptions: {
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          // for @typescript/eslint-parser
          jsxPragma: undefined
        },
        globals: globals.browser
      },
      rules: {
        // plugin:react/recommended
        ...eslint_plugin_react.configs.recommended.rules,
        // plugin:react/jsx-runtime
        ...eslint_plugin_react.configs['jsx-runtime'].rules,
        // plugin:react-hooks/recommended
        ...eslint_plugin_react_hooks.configs.recommended.rules,

        'react-hooks/exhaustive-deps': ['warn', {
          additionalHooks: options.additionalHooks ?? '(useIsomorphicLayoutEffect|useSukkaManyOtherCustomEffectHookExample)'
        }],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': ['warn', {
          extensions: ['.jsx', '.tsx']
        }],
        'react/prop-types': 'off',
        'react/display-name': ['off', { ignoreTranspilerName: false }],
        // exclude styled-jsx and css prop
        'react/no-unknown-property': ['error', { ignore: ['css', 'jsx'] }],
        // Enforce boolean attributes notation in JSX
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
        'react/jsx-boolean-value': ['error', 'never', { always: [] }],
        // Enforce or disallow spaces inside of curly braces in JSX attributes
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
        '@stylistic/jsx/jsx-curly-spacing': ['error', 'never', { allowMultiline: true }],
        // Enforce event handler naming conventions in JSX
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
        'react/jsx-handler-names': ['off', {
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'on'
        }],
        // Validate props indentation in JSX
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
        '@stylistic/jsx/jsx-indent-props': ['error', 2],
        // Limit maximum of props on a single line in JSX
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
        '@stylistic/jsx/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
        // Prevent usage of .bind() in JSX props
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
        'react/jsx-no-bind': ['error', {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
          ignoreDOMComponents: true
        }],
        // Enforce PascalCase for user-defined JSX components
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
        'react/jsx-pascal-case': ['error', {
          allowAllCaps: true,
          ignore: []
        }],
        // Require stateless functions when not using lifecycle methods, setState or ref
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
        'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
        // Require render() methods to return something
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
        'react/require-render-return': 'error',
        // Prevent extra closing tags for components without children
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
        'react/self-closing-comp': 'error',
        // Enforce component methods order
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/sort-comp.md
        'react/sort-comp': ['error', {
          order: [
            'static-variables',
            'static-methods',
            'instance-variables',
            'lifecycle',
            '/^handle.+$/',
            '/^on.+$/',
            'getters',
            'setters',
            '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
            'instance-methods',
            'everything-else',
            'rendering'
          ],
          groups: {
            lifecycle: [
              'displayName',
              'propTypes',
              'contextTypes',
              'childContextTypes',
              'mixins',
              'statics',
              'defaultProps',
              'constructor',
              'getDefaultProps',
              'getInitialState',
              'state',
              'getChildContext',
              'getDerivedStateFromProps',
              'componentWillMount',
              'UNSAFE_componentWillMount',
              'componentDidMount',
              'componentWillReceiveProps',
              'UNSAFE_componentWillReceiveProps',
              'shouldComponentUpdate',
              'componentWillUpdate',
              'UNSAFE_componentWillUpdate',
              'getSnapshotBeforeUpdate',
              'componentDidUpdate',
              'componentDidCatch',
              'componentWillUnmount'
            ],
            rendering: [
              '/^render.+$/',
              'render'
            ]
          }
        }],
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
        // Enforce spacing around jsx equals signs
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
        '@stylistic/jsx/jsx-equals-spacing': ['error', 'never'],
        // Enforce JSX indentation
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
        '@stylistic/jsx/jsx-indent': ['error', 2],
        // Require style prop value be an object or var
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
        'react/style-prop-object': 'error',
        // Validate whitespace in and around the JSX opening and closing brackets
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-tag-spacing.md
        '@stylistic/jsx/jsx-tag-spacing': ['error', {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never'
        }],
        // Prevent usage of Array index in keys
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
        'react/no-array-index-key': 'off',
        // Prevent void DOM elements from receiving children
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
        'react/void-dom-elements-no-children': 'error',
        // Prevent unused state values
        // https://github.com/jsx-eslint/eslint-plugin-react/pull/1103/
        'react/no-unused-state': 'error',
        // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
        '@stylistic/jsx/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
        // Prevent using this.state within a this.setState
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/no-access-state-in-setstate.md
        'react/no-access-state-in-setstate': 'error',
        // Prevent this from being used in stateless functional components
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/no-this-in-sfc.md
        'react/no-this-in-sfc': 'error',
        // Disallow multiple spaces between inline JSX props
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/ac102885765be5ff37847a871f239c6703e1c7cc/docs/rules/jsx-props-no-multi-spaces.md
        '@stylistic/jsx/jsx-props-no-multi-spaces': 'error',
        // Enforce shorthand or standard form for React fragments
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/bc976b837abeab1dffd90ac6168b746a83fc83cc/docs/rules/jsx-fragments.md
        'react/jsx-fragments': ['error', 'syntax'],
        // Enforce linebreaks in curly braces in JSX attributes and expressions.
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
        '@stylistic/jsx/jsx-curly-newline': ['error', {
          multiline: 'consistent',
          singleline: 'consistent'
        }],
        // Prevent usage of `javascript:` URLs
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md
        'react/jsx-no-script-url': ['error', [
          {
            name: 'Link',
            props: ['to', 'href']
          },
          {
            name: 'NextLink',
            props: ['href']
          }
        ]],
        'react/jsx-key': ['warn', { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true, warnOnDuplicates: true }],
        'react/jsx-uses-vars': 'error',
        // Disallow unnecessary fragments
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
        'react/jsx-no-useless-fragment': 'error',
        // Prevent react contexts from taking non-stable values
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/e2eaadae316f9506d163812a09424eb42698470a/docs/rules/jsx-no-constructed-context-values.md
        'react/jsx-no-constructed-context-values': 'error',
        // Prevent creating unstable components inside components
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/c2a790a3472eea0f6de984bdc3ee2a62197417fb/docs/rules/no-unstable-nested-components.md
        'react/no-unstable-nested-components': 'error',
        // Prevent declaring unused methods of component class
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/21e01b61af7a38fc86d94f27eb66cda8054582ed/docs/rules/no-unused-class-component-methods.md
        'react/no-unused-class-component-methods': 'error',
        // Ensure destructuring and symmetric naming of useState hook value and setter variables
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/c8833f301314dab3e79ef7ac4cf863e4d5fa0019/docs/rules/hook-use-state.md
        // Disable for now, fxxking way too many false positives
        'react/hook-use-state': 'off',
        // Enforce sandbox attribute on iframe elements
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/c8833f301314dab3e79ef7ac4cf863e4d5fa0019/docs/rules/iframe-missing-sandbox.md
        'react/iframe-missing-sandbox': 'warn',
        // Prevent problematic leaked values from being rendered
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/c42b624d0fb9ad647583a775ab9751091eec066f/docs/rules/jsx-no-leaked-render.md
        'react/jsx-no-leaked-render': 'off',
        // To prevent potential unnecessary rerenders, and performance regressions
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/66b58dd4864678eb869a7bf434c72ff7ac530eb1/docs/rules/no-object-type-as-default-prop.md
        'react/no-object-type-as-default-prop': 'warn',
        // default type is "submit" which refresh the page
        'react/button-has-type': 'error',
        'react/no-namespace': 'error', // <svg:rect> react does not support

        'class-methods-use-this': ['error', {
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
        'jsx-a11y/alt-text': [
          'warn',
          {
            elements: ['img'],
            img: ['Image']
          }
        ],
        'jsx-a11y/aria-props': 'warn',
        'jsx-a11y/aria-proptypes': 'warn',
        'jsx-a11y/aria-unsupported-elements': 'warn',
        'jsx-a11y/role-has-required-aria-props': 'warn',
        'jsx-a11y/role-supports-aria-props': 'warn'
      }
    }
  ];
};
