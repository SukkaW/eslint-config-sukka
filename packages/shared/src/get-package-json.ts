import path from 'path';
import fs from 'fs';

const SKIP_TIME = 20000;

/**
 * The class of cache.
 * The cache will dispose of each value if the value has not been accessed
 * during 20 seconds.
 */
class Cache<T> {
  /**
   * Initialize this cache instance.
   */
  map = new Map<string, { expire: number, value: T }>();

  /**
   * Get the cached value of the given key.
   */
  get(key: string): T | null {
    const entry = this.map.get(key);
    const now = Date.now();

    if (entry) {
      if (entry.expire > now) {
        entry.expire = now + SKIP_TIME;
        return entry.value;
      }
      this.map.delete(key);
    }
    return null;
  }

  /**
   * Set the value of the given key.
   * @returns {void}
   */
  set(key: string, value: T) {
    const entry = this.map.get(key);
    const expire = Date.now() + SKIP_TIME;

    if (entry) {
      entry.value = value;
      entry.expire = expire;
    } else {
      this.map.set(key, { value, expire });
    }
  }
}

const cache = new Cache<Record<string, any> | null>();

/**
 * Reads the `package.json` data in a given path.
 *
 * Don't cache the data.
 *
 * @param dir - The path to a directory to read.
 * @returns The read `package.json` data, or null.
 */
function readPackageJson(dir: string): Record<string, any> | null {
  const filePath = path.join(dir, 'package.json');
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    const data: Record<string, any> | null | undefined = JSON.parse(text);

    if (data && typeof data === 'object') {
      data.filePath = filePath;
      return data;
    }
  } catch {
    // do nothing.
  }

  return null;
}

/**
* Gets a `package.json` data.
* The data is cached if found, then it's used after.
*
* @param startPath - A file path to lookup.
* @returns A found `package.json` data or `null`.
*      This object have additional property `filePath`.
*/
export function getPackageJson(startPath = 'a.js'): Record<string, any> | null {
  const startDir = path.dirname(path.resolve(startPath));
  let dir: string = startDir;
  let prevDir = '';
  let data: Record<string, any> | null = null;

  do {
    data = cache.get(dir);
    if (data) {
      if (dir !== startDir) {
        cache.set(startDir, data);
      }
      return data;
    }

    data = readPackageJson(dir);
    if (data) {
      cache.set(dir, data);
      cache.set(startDir, data);
      return data;
    }

    // Go to next.
    prevDir = dir;
    dir = path.resolve(dir, '..');
  } while (dir !== prevDir);

  cache.set(startDir, null);
  return null;
}
