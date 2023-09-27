import path from 'path';

import picocolors from 'picocolors';
import stringWidth from 'string-width';
import ansiEscapes from 'ansi-escapes';
import { supportsHyperlink } from 'supports-hyperlinks';

import type { ESLint } from 'eslint';

interface Separator {
  type: 'separator'
}

interface Header {
  type: 'header',
  filePath: string,
  relativeFilePath: string,
  firstLineCol: `${string}:${string}`
}

interface Line {
  type: 'message',
  relativeFilePath?: string,
  severity?: 'error' | 'warning' | 1 | 2,
  firstLineCol?: `${string}:${string}`,
  ruleId: string,
  lineWidth: number,
  columnWidth: number,
  messageWidth: number,
  line: string,
  message: string,
  column: string
}

const logSymbols = {
  info: picocolors.blue('i'),
  success: picocolors.green('√'),
  warning: picocolors.yellow('‼'),
  error: picocolors.red('×')
};

export const pretty: ESLint.Formatter['format'] = (results, data): string => {
  const lines: Array<Line | Separator | Header> = [];
  let errorCount = 0;
  let warningCount = 0;
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
      const { messages, filePath } = result;

      if (messages.length === 0) return;

      errorCount += result.errorCount;
      warningCount += result.warningCount;

      if (lines.length !== 0) {
        lines.push({ type: 'separator' });
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
          let { message } = x;

          // Stylize inline code blocks
          message = message.replaceAll(/\B`(.*?)`\B|\B'(.*?)'\B/g, (m, p1, p2) => picocolors.bold(p1 || p2));

          const line = String(x.line || 0);
          const column = String(x.column || 0);
          const lineWidth = stringWidth(line);
          const columnWidth = stringWidth(column);
          const messageWidth = stringWidth(message);

          maxLineWidth = Math.max(lineWidth, maxLineWidth);
          maxColumnWidth = Math.max(columnWidth, maxColumnWidth);
          maxMessageWidth = Math.max(messageWidth, maxMessageWidth);
          showLineNumbers = showLineNumbers || x.line || x.column;

          lines.push({
            type: 'message',
            severity: (x.fatal || x.severity === 2 || (x.severity as any) === 'error') ? 'error' : 'warning',
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

  if (process.stdout.isTTY && !process.env.CI) {
    // Make relative paths Command-clickable in iTerm
    output += ansiEscapes.iTerm.setCwd();
  }

  output += `${lines.map(x => {
    if (x.type === 'header') {
      // Add the line number so it's Command-click'able in some terminals
      // Use dim & gray for terminals like iTerm that doesn't support `hidden`
      const position = showLineNumbers ? picocolors.hidden(picocolors.dim(picocolors.gray(`:${x.firstLineCol}`))) : '';

      return `  ${picocolors.underline(x.relativeFilePath)}${position}`;
    }

    if (x.type === 'message') {
      let ruleUrl;

      try {
        ruleUrl = data?.rulesMeta[x.ruleId]?.docs?.url;
      } catch {
        try {
          // ruleUrl = getRuleDocs(x.ruleId).url;
        } catch { }
      }

      const line = [
        '',
        x.severity === 'warning' ? logSymbols.warning : logSymbols.error,
        ' '.repeat(maxLineWidth - x.lineWidth) + picocolors.dim(x.line + picocolors.gray(':') + x.column),
        ' '.repeat(maxColumnWidth - x.columnWidth) + x.message,
        ' '.repeat(maxMessageWidth - x.messageWidth)
        + (ruleUrl && supportsHyperlink(process.stdout) ? (picocolors.dim(x.ruleId), ruleUrl) : picocolors.dim(x.ruleId))
      ];

      if (!showLineNumbers) {
        line.splice(2, 1);
      }

      return line.join('  ');
    }

    return '';
  }).join('\n')}\n\n`;

  if (warningCount > 0) {
    output += `  ${picocolors.yellow(`${warningCount} warning`)}\n`;
  }

  if (errorCount > 0) {
    output += `  ${picocolors.red(`${errorCount} error`)}\n`;
  }

  return (errorCount + warningCount) > 0 ? output : '';
};
