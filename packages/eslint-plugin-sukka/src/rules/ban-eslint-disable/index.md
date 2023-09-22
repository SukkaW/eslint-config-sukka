# `eslint-plugin-sukka/ban-eslint-disable`

Ban `eslint-disable` comment directive

## Rule Details

see <https://eslint.org/docs/user-guide/configuring/rules>

TypeScript Support: <https://typescript-eslint.io/rules/ban-ts-comment>

## Options

```ts
/**
 * @minItems Infinity
 */
export type Options = [boolean | 'allow-with-description']
```
<!-- end options -->
### :x: Incorrect
```ts
// eslint-disable-next-line
console.log(error)
```
### :white_check_mark: Correct
```ts
// eslint-disable-next-line no-console -- Log a error
console.log(error)
```
