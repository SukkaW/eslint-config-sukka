export const GLOB_TS = '**/*.?([cm])ts';
export const GLOB_TSX = '**/*.?([cm])tsx';
export const GLOB_JS = '**/*.?([cm])js';
export const GLOB_JSX = '**/*.?([cm])jsx';

export const GLOB_SRC_EXT = '?([cm])[jt]s?(x)';
export const GLOB_SRC = '**/*.?([cm])[jt]s?(x)';

export const GLOB_JSON = '**/*.json';
export const GLOB_JSONC = '**/*.jsonc';
export const GLOB_JSON5 = '**/*.json5';
export const GLOB_ALL_JSON = [GLOB_JSON, GLOB_JSONC, GLOB_JSON5];

export const GLOB_TESTS = [
  `**/__tests__/**/*.${GLOB_SRC_EXT}`,
  `**/*.spec.${GLOB_SRC_EXT}`,
  `**/*.test.${GLOB_SRC_EXT}`
];

export const GLOB_EXCLUDE = [
  '**/node_modules',
  '**/dist',

  '**/output',
  '**/out',
  '**/coverage',
  '**/temp',
  '**/tmp',
  '**/.vitepress/cache',
  '**/.next',
  '**/.nuxt',
  '**/.vercel',
  '**/.changeset',
  '**/.idea',
  '**/.output',
  '**/.vite-inspect',

  '**/*.md', // '**/CHANGELOG*.md',
  '**/*.min.*',
  '**/__snapshots__',
  '**/fixtures',
  '**/auto-import?(s).d.ts',
  '**/components.d.ts'
];
