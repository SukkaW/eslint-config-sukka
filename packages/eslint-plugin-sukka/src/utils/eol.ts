export function detectEol(str: string) {
  for (let i = 0, len = str.length; i < len; i++) {
    const c = str[i];
    if (c === '\n') return '\n';
    if (c === '\r' && str[i + 1] === '\n') return '\r\n';
  }
  return '\n';
}
