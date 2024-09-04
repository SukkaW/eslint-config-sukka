export function detectEol(str: string): '\n' | '\r\n' {
  return str.includes('\r\n') ? '\r\n' : '\n';
}
