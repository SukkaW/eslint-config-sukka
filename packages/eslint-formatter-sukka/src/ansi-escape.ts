// const ESC = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

const PARAM_SEP = ':';
const EQ = '=';

export const link = (text: string, url: string, params: Record<string, string> = {}) => [
  OSC,
  '8',
  SEP,
  Object.keys(params).map(key => key + EQ + params[key]).join(PARAM_SEP),
  SEP,
  url,
  BEL,
  text,
  OSC,
  '8',
  SEP,
  SEP,
  BEL
].join('');

export const iTermSetCwd = (cwd = process.cwd()) => `${OSC}50;CurrentDir=${cwd}${BEL}`;
