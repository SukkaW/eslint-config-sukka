const npm = (pkgName: string) => `https://www.npmjs.com/package/${pkgName}`;

/** 福妮严选 */
export const BETTER_ALTERNATIVES = Object.entries({
  // deep equal
  'deep-equal': npm('dequal'),
  'fast-deep-equal': npm('dequal'),
  // ansi color / cursor
  chalk: `simple color ${npm('picocolors')}, hex color https://github.com/webdiscus/ansis`,
  kleur: npm('picocolors'),
  'ansi-escapes': npm('sisteransi'),
  // mime
  'mime-db': npm('mrmime'),
  'mime-types': npm('mrmime'),
  // lru
  'lru-cache': `w/o TTL ${npm('flru')}, w/ TTL TTL: ${npm('tiny-lru')}`,
  'tmp-cache': `w/o TTL ${npm('flru')}, w/ TTL TTL: ${npm('tiny-lru')}`,
  // fs operations
  premove: 'Node.js built-in fs.rmdir & fs.rm API',
  rimraf: 'Node.js built-in fs.rmdir & fs.rm API',
  mkdirp: 'Node.js built-in fs.mkdir API',
  'make-dir': 'Node.js built-in fs.mkdir API',
  'mk-dirs': 'Node.js built-in fs.mkdir API',
  // network
  axios: npm('ky'),
  'node-fetch': `${npm('undici')} (preferred) or ${npm('node-fetch-native')}`,
  got: `${npm('undici')} and ${npm('async-retry')}`,
  'get-port': npm('get-port-please'),
  // react
  'react-query': 'https://swr.vercel.app',
  '@tanstack/react-query': 'https://swr.vercel.app',
  '@tanstack/react-query-devtools': 'https://swr.vercel.app',
  ahooks: 'https://foxact.skk.moe and https://swr.vercel.app',
  // deep clone
  'clone-deep': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  'deep-copy': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  'fast-copy': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  'lodash.clonedeep': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  clone: `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  // misc
  ms: npm('@lukeed/ms'),
  classnames: npm('clsx'),
  classcat: npm('clsx'),
  'p-limit': `${npm('superlock')} / ${npm('@henrygd/queue')} / ${npm('async-sema')}`,
  'p-retry': npm('async-retry'),
  ora: npm('nanospinner'),
  'ts-results': npm('ts-results-es'),
  dayjs: npm('date-fns'),
  tldjs: npm('tldts'),
  'types-package-json': npm('@package-json/types'),
  'xxhash-wasm': `${npm('hash-wasm')}, significantly faster`,
  'string-width': npm('fast-string-width'),
  lodash: 'https://es-toolkit.slash.page',
  // escape string regexp
  'escape-string-regexp': npm('foxts'),
  'escape-regexp': npm('foxts'),
  'lodash.escaperegexp': npm('foxts'),
  'regex-escape': npm('foxts'),
  // esacpe html
  'escape-html': npm('foxts'),
  'html-escaper': npm('foxts'),
  'escape-goat': npm('foxts'),
  'lodash.escape': npm('foxts'),
  'next-init': 'https://github.com/QuiiBz/next-international',
  'https://github.com/i18next/next-i18next': 'https://github.com/QuiiBz/next-international'
}).map(([key, value]) => ({ name: key, message: `Use ${value} instead.` }));

const restricedImportBase = [
  { name: 'date-fns/esm', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'idb/with-async-ittr-cjs', message: 'Please use idb/with-async-ittr instead.' },
  { name: 'lodash-unified', message: 'Do not import lodash-unified directly' },
  { name: 'react-fast-compare', message: 'What\'s faster than a really fast deep comparison? No deep comparison at all.' }
];

/** eslint-plugin-n/no-restricted-require doesn't support "importNames" */
const restrictedImportWithImportNames = [
  { name: 'lodash', message: 'Avoid using type unsafe methods.', importNames: ['get'] },
  { name: 'lodash-es', message: 'Avoid using type unsafe methods.', importNames: ['get'] },
  { name: 'lodash', message: `Use ${npm('rfdc')} for Node.js / ${npm('klona')} for Browser instead`, importNames: ['cloneDeep'] },
  { name: 'lodash-es', message: `Use ${npm('rfdc')} for Node.js / ${npm('klona')} for Browser instead`, importNames: ['cloneDeep'] },
  { name: 'uuid', importNames: ['v4'], message: `Use ${npm('@lukeed/uuid')} instead` },
  { name: 'assert', importNames: ['deepEqual'], message: `Use ${npm('dequal')} instead` },
  { name: 'react', importNames: ['useLayoutEffect'], message: 'Use https://foxact.skk.moe/use-isomorphic-layout-effect instead' }
];

export const RESTRICTED_IMPORT_JS = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.' },
  { name: 'react', importNames: ['default'], message: 'Use named import instead' },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES,
  ...restrictedImportWithImportNames
];

export const RESTRICTED_IMPORT_TS = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.', allowTypeImports: true },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.', allowTypeImports: true },
  { name: 'react', importNames: ['default'], message: 'Use named import instead', allowTypeImports: true },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES,
  ...restrictedImportWithImportNames
];

export const RESTRICTED_IMPORT_NODE_REQUIRE = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.' },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES
];
