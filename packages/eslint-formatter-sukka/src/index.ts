import path from 'node:path';
import process from 'node:process';

import picocolors from 'picocolors';
import fastStringWidth from 'fast-string-width';
import { createSupportsHyperlinks } from 'supports-hyperlinks';

import { link, iTermSetCwd } from './ansi-escape';
import { isCI } from 'ci-info';

import type { ESLint, Linter } from 'eslint';
import { pathToFileURL } from 'node:url';
import { hostname } from 'node:os';

import { fastStringArrayJoin } from 'foxts/fast-string-array-join';
import { appendArrayInPlace } from 'foxts/append-array-in-place';
import { invariant } from 'foxts/guard';

const separatorLine = {
  type: 'separator'
} as const;

type Separator = typeof separatorLine;

interface Header {
  type: 'header',
  filePath: string,
  relativeFilePath: string,
  firstLineCol: `${string | number}:${string | number}`
}

interface Line {
  type: 'message',
  relativeFilePath?: string,
  severity?: 'fatal' | 'error' | 'warning',
  firstLineCol?: `${string}:${string}`,
  ruleId: string,
  lineWidth: number,
  columnWidth: number,
  messageWidth: number,
  line: string,
  message: string,
  column: string
}

const pretty: ESLint.FormatterFunction = (results, data): string => {
  const lines: Array<Line | Separator | Header | null> = [];
  let errorCount = 0;
  let warningCount = 0;
  let fatalErrorCount = 0;
  let fixableCount = 0;
  const deprecatedReplacedBy: Record<string, string[]> = {};

  let maxLineWidth = 0;
  let maxColumnWidth = 0;
  let maxMessageWidth = 0;
  let showLineNumbers: number | boolean = false;

  results.sort((a, b) => {
    if (a.errorCount === b.errorCount) {
      return b.warningCount - a.warningCount;
    }

    if (a.errorCount === 0) return -1;
    if (b.errorCount === 0) return 1;

    return b.errorCount - a.errorCount;
  });

  for (let i = 0, len = results.length; i < len; i++) {
    const result = results[i];
    const { messages, filePath, usedDeprecatedRules } = result;

    if (messages.length === 0) continue;

    errorCount += result.errorCount;
    warningCount += result.warningCount;
    fatalErrorCount += result.fatalErrorCount;
    fixableCount += result.fixableWarningCount + result.fixableErrorCount;

    usedDeprecatedRules.forEach(d => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- strictNullChecks
      appendArrayInPlace((deprecatedReplacedBy[d.ruleId] ||= []), d.replacedBy);
    });

    if (lines.length !== 0) {
      lines.push(separatorLine);
    }

    let firstErrorOrWarning: Linter.LintMessage | undefined;

    const headerIndex = lines.push(null) - 1;

    messages.sort((a, b) => {
      if (a.fatal === b.fatal && a.severity === b.severity) {
        if (a.line === b.line) {
          return a.column < b.column ? -1 : 1;
        }

        return a.line < b.line ? -1 : 1;
      }

      if ((a.fatal || a.severity === 2) && (!b.fatal || b.severity !== 2)) {
        return 1;
      }

      return -1;
    });

    for (let j = 0, messageLen = messages.length; j < messageLen; j++) {
      const x = messages[j];
      const isError = x.severity === 2 || (x.severity as unknown) === 'error';

      if (isError) {
        firstErrorOrWarning ||= x;
      }

      // Stylize inline code blocks
      const message = x.message.replaceAll(/\B`(.+?)`\B|\B'(.+?)'\B|\B"(.+?)"\B/g, (m, p1, p2, p3) => picocolors.bold(p1 || p2 || p3));

      const line = String(x.line || 0);
      const column = String(x.column || 0);
      const lineWidth = fastStringWidth(line);
      const columnWidth = fastStringWidth(column);
      const messageWidth = fastStringWidth(message);

      if (lineWidth > maxLineWidth) {
        maxLineWidth = lineWidth;
      }

      if (columnWidth > maxColumnWidth) {
        maxColumnWidth = columnWidth;
      }
      if (messageWidth > maxMessageWidth) {
        maxMessageWidth = messageWidth;
      }

      showLineNumbers ||= x.line || x.column;

      lines.push({
        type: 'message',
        severity: x.fatal
          ? 'fatal'
          : (isError
            ? 'error'
            : 'warning'),
        line,
        lineWidth,
        column,
        columnWidth,
        message,
        messageWidth,
        ruleId: x.ruleId || ''
      });
    };

    if (firstErrorOrWarning == null) {
      firstErrorOrWarning = messages[0];
    }

    lines[headerIndex] = {
      type: 'header',
      filePath,
      relativeFilePath: path.relative('.', filePath),
      firstLineCol: `${firstErrorOrWarning.line}:${firstErrorOrWarning.column}`
    } satisfies Header;
  }

  let output = '\n';

  if (process.stdout.isTTY && process.env.TERM_PROGRAM === 'iTerm.app' && !isCI) {
    // Make relative paths Command-clickable in iTerm
    output += iTermSetCwd();
  }

  const hasHyperlink = !isCI && createSupportsHyperlinks(process.stdout);
  const osHostname = hostname();
  const isGnomeTerminal = process.env.GNOME_TERMINAL_SCREEN;

  output += fastStringArrayJoin(
    lines.map(x => {
      invariant(x, '[eslint-formatter-sukka] message can not be null');

      if (x.type === 'header') {
        // Add the line number so it's Command-click'able in some terminals
        // Use dim & gray for terminals like iTerm that doesn't support `hidden`
        const position = showLineNumbers ? picocolors.hidden(picocolors.dim(picocolors.gray(`:${x.firstLineCol}`))) : '';

        if (isGnomeTerminal) {
          const fileUrl = pathToFileURL(x.filePath, {});

          fileUrl.hostname = osHostname;

          return link(x.relativeFilePath, fileUrl.href) + position;
        }

        return picocolors.underline(x.relativeFilePath) + position;
      }

      if (x.type === 'message') {
        let ruleUrl;

        if (hasHyperlink && data && 'rulesMeta' in data && x.ruleId in data.rulesMeta) {
          ruleUrl = data.rulesMeta[x.ruleId].docs?.url;
        }

        const line = [
          '',
          x.severity === 'warning' ? picocolors.yellow('warn ') : picocolors.red('error'),

          showLineNumbers
            ? ' '.repeat(maxLineWidth - x.lineWidth) + picocolors.dim(x.line + picocolors.gray(':') + x.column)
            : '',

          ' '.repeat(maxColumnWidth - x.columnWidth) + x.message,
          ' '.repeat(maxMessageWidth - x.messageWidth),

          hasHyperlink && ruleUrl
            ? link(picocolors.dim(x.ruleId), ruleUrl)
            : picocolors.dim(x.ruleId)
        ];

        return fastStringArrayJoin(line, ' ');
      }

      return '';
    }),
    '\n'
  );
  output += '\n\n';

  const deprecatedEntries = Object.entries(deprecatedReplacedBy);
  const deprecatedCount = deprecatedEntries.length;

  const stats = ([
    ['problem', true, errorCount + warningCount + fatalErrorCount] as const,
    ['warning', true, warningCount > 0 ? picocolors.yellow(warningCount) : picocolors.green(0)] as const,
    ['error', true, errorCount > 0 ? picocolors.red(errorCount) : picocolors.green(0)] as const,
    ['fatal', fatalErrorCount > 0, picocolors.red(fatalErrorCount)] as const,
    ['fixable', fixableCount > 0, fixableCount] as const,
    ['deprecated', deprecatedCount > 0, picocolors.bold(picocolors.gray(deprecatedCount))] as const
  ]).filter(([, show]) => show);

  const maxKeyWidth = Math.max(...stats.map(([key]) => key.length));

  stats.forEach(stat => {
    const [key, _, value] = stat;
    output += `${' '.repeat(maxKeyWidth - key.length)}${picocolors.bold(`${key}:`)}  ${value}\n`;
  });

  if (deprecatedCount > 0) {
    deprecatedEntries.forEach(([ruleId, replacedBy]) => {
      output += '\n';
      output += `${picocolors.gray('deprecated:')}  ${ruleId}`;
      output += replacedBy.length > 0 ? picocolors.gray(` (replaced by ${fastStringArrayJoin(replacedBy.map(picocolors.white), ', ')})`) : '';
    });
  }

  output += '\n';

  return (errorCount + warningCount + fatalErrorCount + deprecatedCount) > 0 ? output : '';
};

export default pretty;
