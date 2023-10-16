import path from 'path';

import picocolors from 'picocolors';
import stringWidth from 'string-width';
import { supportsHyperlink } from 'supports-hyperlinks';

import { link, iTermSetCwd } from './ansi-escape';
import { isCI } from 'ci-info';

import type { ESLint } from 'eslint';

const separatorLine = {
  type: 'separator'
} as const;

type Separator = typeof separatorLine;

interface Header {
  type: 'header',
  filePath: string,
  relativeFilePath: string,
  firstLineCol: `${string}:${string}`
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

const NON_DEPRECATED_RULES = new Set([
  'no-return-await'
]);

const pretty: ESLint.Formatter['format'] = (results, data): string => {
  const lines: Array<Line | Separator | Header> = [];
  let errorCount = 0;
  let warningCount = 0;
  let fatalErrorCount = 0;
  let fixableWarningCount = 0;
  let fixableErrorCount = 0;
  const deprecatedReplacedBy: Record<string, string[]> = {};

  let maxLineWidth = 0;
  let maxColumnWidth = 0;
  let maxMessageWidth = 0;
  let showLineNumbers: number | boolean = false;

  results
    .sort((a, b) => {
      if (a.errorCount === b.errorCount) return b.warningCount - a.warningCount;
      if (a.errorCount === 0) return -1;
      if (b.errorCount === 0) return 1;
      return b.errorCount - a.errorCount;
    })
    .forEach(result => {
      const { messages, filePath, usedDeprecatedRules } = result;

      if (messages.length === 0) return;

      errorCount += result.errorCount;
      warningCount += result.warningCount;
      fatalErrorCount += result.fatalErrorCount;
      fixableWarningCount += result.fixableWarningCount;
      fixableErrorCount += result.fixableErrorCount;

      usedDeprecatedRules.forEach(d => {
        if (NON_DEPRECATED_RULES.has(d.ruleId)) return;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- strictNullChecks
        deprecatedReplacedBy[d.ruleId] ||= d.replacedBy;
      });

      if (lines.length !== 0) {
        lines.push(separatorLine);
      }

      const firstErrorOrWarning = messages.find(({ severity }) => severity === 2) || messages[0];

      lines.push({
        type: 'header',
        filePath,
        relativeFilePath: path.relative('.', filePath),
        firstLineCol: `${firstErrorOrWarning.line}:${firstErrorOrWarning.column}`
      });

      messages
        .sort((a, b) => {
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
        })
        .forEach(x => {
          // Stylize inline code blocks
          const message = x.message.replaceAll(/\B`(.*?)`\B|\B'(.*?)'\B/g, (m, p1, p2) => picocolors.bold(p1 || p2));

          const line = String(x.line || 0);
          const column = String(x.column || 0);
          const lineWidth = stringWidth(line);
          const columnWidth = stringWidth(column);
          const messageWidth = stringWidth(message);

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
              : (
                (x.severity === 2 || (x.severity as any) === 'error')
                  ? 'error'
                  : 'warning'
              ),
            line,
            lineWidth,
            column,
            columnWidth,
            message,
            messageWidth,
            ruleId: x.ruleId || ''
          });
        });
    });

  let output = '\n';

  if (process.stdout.isTTY && !isCI) {
    // Make relative paths Command-clickable in iTerm
    output += iTermSetCwd();
  }

  output += `${lines.map(x => {
    if (x.type === 'header') {
      // Add the line number so it's Command-click'able in some terminals
      // Use dim & gray for terminals like iTerm that doesn't support `hidden`
      const position = showLineNumbers ? picocolors.hidden(picocolors.dim(picocolors.gray(`:${x.firstLineCol}`))) : '';

      return `${picocolors.underline(x.relativeFilePath)}${position}`;
    }

    if (x.type === 'message') {
      let ruleUrl;

      try {
        ruleUrl = data?.rulesMeta[x.ruleId]?.docs?.url;
      } catch { }

      const line = [
        '',
        x.severity === 'warning' ? picocolors.yellow('warn ') : picocolors.red('error'),
        ' '.repeat(maxLineWidth - x.lineWidth) + picocolors.dim(x.line + picocolors.gray(':') + x.column),
        ' '.repeat(maxColumnWidth - x.columnWidth) + x.message,
        ' '.repeat(maxMessageWidth - x.messageWidth)
        + (
          (ruleUrl && supportsHyperlink(process.stdout))
            ? link(picocolors.dim(x.ruleId), ruleUrl)
            : picocolors.dim(x.ruleId)
        )
      ];

      if (!showLineNumbers) {
        line.splice(2, 1);
      }

      return line.join(' ');
    }

    return '';
  }).join('\n')}\n\n`;

  const deprecatedEntries = Object.entries(deprecatedReplacedBy);
  const deprecatedCount = deprecatedEntries.length;

  const stats = Object.entries({
    problem: [true, errorCount + warningCount + fatalErrorCount] as const,
    warning: [true, warningCount > 0 ? picocolors.yellow(warningCount) : picocolors.green(0)] as const,
    error: [true, errorCount > 0 ? picocolors.red(errorCount) : picocolors.green(0)] as const,
    fatal: [fatalErrorCount > 0, picocolors.red(fatalErrorCount)] as const,
    fixable: [(fixableErrorCount + fixableWarningCount) > 0, fixableErrorCount + fixableWarningCount] as const,
    deprecated: [deprecatedCount > 0, picocolors.bold(picocolors.gray(deprecatedCount))] as const
  }).filter(([, [show]]) => show);

  const maxKeyWidth = Math.max(...stats.map(([key]) => key.length));

  stats.forEach(stat => {
    const [key, [, value]] = stat;
    output += `${' '.repeat(maxKeyWidth - key.length)}${picocolors.bold(`${key}:`)}  ${value}\n`;
  });

  if (deprecatedCount > 0) {
    deprecatedEntries.forEach(([ruleId, replacedBy]) => {
      output += '\n';
      output += `${picocolors.gray('deprecated:')}  ${ruleId}`;
      output += replacedBy.length > 0 ? picocolors.gray(` (replaced by ${replacedBy.map(picocolors.white).join(', ')})`) : '';
    });
  }

  output += '\n';

  return (errorCount + warningCount + fatalErrorCount + deprecatedCount) > 0 ? output : '';
};

export default pretty;
