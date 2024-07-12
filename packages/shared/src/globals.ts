import {
  es2025 as globalEs2025,
  browser as globalBrowser,
  webextensions as globalWebextensions,
  greasemonkey as globalGreasemonkey,
  node as globalNode
} from 'globals/globals.json';

export const es2025: Record<string, boolean> = globalEs2025;
export const browser: Record<string, boolean> = globalBrowser;
export const webextensions: Record<string, boolean> = globalWebextensions;
export const greasemonkey: Record<string, boolean> = globalGreasemonkey;
export const node: Record<string, boolean> = globalNode;
