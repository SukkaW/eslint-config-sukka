import process from 'node:process';

// const ESC = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

const PARAM_SEP = ':';
const EQ = '=';

export function link(text: string, url: string, params: Record<string, string> = {}) {
  return OSC
    + '8'
    + SEP
    + Object.keys(params).map(key => key + EQ + params[key]).join(PARAM_SEP)
    + SEP
    + url
    + BEL
    + text
    + OSC
    + '8'
    + SEP
    + SEP
    + BEL;
}

export function iTermSetCwd(cwd = process.cwd()) {
  return OSC
    + '50;'
    + 'CurrentDir='
    + cwd
    + BEL;
}
