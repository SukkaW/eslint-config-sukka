// const ESC = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

export const link = (text: string, url: string) => [
  OSC,
  '8',
  SEP,
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
