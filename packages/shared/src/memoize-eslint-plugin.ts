declare global {
  // eslint-disable-next-line vars-on-top, no-var -- fuck
  var __ESLINT_PLUGIN_MEMO__: Record<string, unknown> | undefined;
}

/**
 * Every package manager has this flaw: Even if a pinned, same version of transive dependency
 * is depended on by multiple packages, all npm/pnpm/yarn/bun will not dedupe it, some package
 * manager even doesn't have dedupe feature (yes, bun. You are literally wasting my disk space
 * for speed).
 *
 * But if there are multiple copy of the same version of transive dependency, they will not have
 * the same referential identity, which causes ESLint to panic and throw error.
 *
 * So we have to memoize the plugins and configs to make sure they are the same referential identity.
 */
export function memo<T>(fn: NonNullable<T>, key?: string): T {
  let $key = key;
  if (!$key) {
    if (typeof fn.toString === 'function') {
      $key = fn.toString();
    } else {
      throw new TypeError('memo() requires a key!');
    }
  }

  globalThis.__ESLINT_PLUGIN_MEMO__ ||= {};
  globalThis.__ESLINT_PLUGIN_MEMO__[$key] ||= fn;
  return globalThis.__ESLINT_PLUGIN_MEMO__[$key] as T;
}
