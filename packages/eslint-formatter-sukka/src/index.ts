import process from 'node:process';
import path from 'node:path';

import picocolors from 'picocolors';
import fastStringWidth from 'fast-string-width';
import supportsHyperlinks from 'supports-hyperlinks';
import terminalSize from 'terminal-size';

import { link, iTermSetCwd } from './ansi-escape';
import { isCI } from 'ci-info';

import type { ESLint, Linter } from 'eslint';
import { pathToFileURL } from 'node:url';
import { hostname } from 'node:os';

import { fastStringArrayJoin } from 'foxts/fast-string-array-join';
import { addArrayElementsToSet } from 'foxts/add-array-elements-to-set';
import { never } from 'foxts/guard';
import { lazyValue } from 'foxts/lazy-value';

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

const enum Severity {
  Warn = 1,
  Error = 2,
  Fatal = 3
}

interface Line {
  type: 'message',
  relativeFilePath?: string,
  severity: Severity,
  firstLineCol?: `${string}:${string}`,
  ruleId: string,
  lineWidth: number,
  columnWidth: number,
  messageWidth: number,
  line: string,
  message: string,
  column: string,
  /** alignment column shared by every message of the same file, resolved after the file is fully read */
  align: { width: number }
}

/**
 * Ratio of the terminal width that the message column is allowed to occupy. Beyond this, aligning
 * the ruleId costs more readability (a screenful of blank padding) than it buys.
 */
const MAX_ALIGN_RATIO = 0.6;
/** Never collapse alignment below this, even on a very narrow terminal. */
const MIN_ALIGN_WIDTH = 20;

// `terminalSize()` may shell out to `tput`/`stty` when stdout is not a TTY, so resolve it lazily and
// only once per run -- and never at import time, since the formatter may be loaded without being used.
const terminalWidth = lazyValue(() => terminalSize().columns);

/**
 * Pick the column at which ruleIds are aligned for a single file block.
 *
 * Aligning on the longest message means one outlier report pads every other line out to its width.
 * Instead, cap the column at a fraction of the terminal and align on the widest message that still
 * fits under that cap -- so every message narrower than the cap lines up exactly, and only the
 * genuine outliers overflow and take a single space before their ruleId.
 */
function resolveAlignWidth(messageWidths: number[], reservedWidth: number): number {
  const cap = Math.max(
    MIN_ALIGN_WIDTH,
    Math.trunc(terminalWidth() * MAX_ALIGN_RATIO) - reservedWidth
  );

  let width = 0;
  for (let i = 0, len = messageWidths.length; i < len; i++) {
    const messageWidth = messageWidths[i];
    if (messageWidth > width && messageWidth <= cap) {
      width = messageWidth;
    }
  }

  return width;
}

const severityToAnsiColoredPrefixMap = {
  [Severity.Warn]: picocolors.yellow('warn '),
  [Severity.Error]: picocolors.red('error'),
  [Severity.Fatal]: picocolors.redBright('fatal')
};

const rQuoteStyle = /\B`(.+?)`\B|\B'(.+?)'\B|\B"(.+?)"\B/g;

// Cache hostname for performance
const osHostname = lazyValue(hostname);

// Pre-determine Header render method (based on env), to avoid `if` in the loop
let renderHeader: (header: Header, position: string) => string;
if (process.env.GNOME_TERMINAL_SCREEN) {
  // GNOME Terminal Link only accepts URL, need special handling
  renderHeader = (header, position) => {
    const fileUrl = pathToFileURL(header.filePath, {});
    fileUrl.hostname = osHostname();
    return link(header.relativeFilePath, fileUrl.href) + position;
  };
} else {
  renderHeader = (header, position) => picocolors.underline(header.relativeFilePath) + position;
}

const hasHyperlink = !isCI && supportsHyperlinks.stdout && supportsHyperlinks.stderr;

// Pre-determine ruleId render method (based on hyperlinks support), to avoid `if` in the loop
let renderRuleId: (ruleId: string, data: ESLint.LintResultData) => string;
if (hasHyperlink) {
  renderRuleId = (ruleId, data: ESLint.LintResultData) => {
    if ('rulesMeta' in data && ruleId in data.rulesMeta) {
      const ruleUrl = data.rulesMeta[ruleId].docs?.url;
      if (ruleUrl) {
        return link(picocolors.dim(ruleId), ruleUrl);
      }
    }

    return picocolors.dim(ruleId);
  };
} else {
  renderRuleId = (ruleId, _) => picocolors.dim(ruleId);
}

const pretty: ESLint.FormatterFunction = (results, data): string => {
  const lines: Array<Line | Separator | Header> = [];
  let errorCount = 0;
  let warningCount = 0;
  let fatalErrorCount = 0;
  let fixableCount = 0;

  // let suppressedCount = 0;

  const deprecatedReplacedBy: Record<string, Set<string>> = {};

  let maxLineWidth = 0;
  let maxColumnWidth = 0;
  let showLineNumbers: number | boolean = false;

  // Alignment is resolved per file, so every file block gets its own shared, mutable holder.
  const alignments: Array<{ align: { width: number }, messageWidths: number[] }> = [];

  results.sort(lintResultSorter);

  for (let i = 0, len = results.length; i < len; i++) {
    const result = results[i];
    const {
      messages, filePath, usedDeprecatedRules,
      fixableWarningCount, fixableErrorCount
    } = result;

    // if ('suppressedMessages' in result) {
    //   // eslint-disable-next-line sukka/unicorn/consistent-destructuring -- suppressedMessages may not exist, need type guard
    //   suppressedCount += result.suppressedMessages.length;
    // }

    if (messages.length === 0) continue;

    errorCount += result.errorCount;
    warningCount += result.warningCount;
    fatalErrorCount += result.fatalErrorCount;
    fixableCount += fixableWarningCount + fixableErrorCount;

    usedDeprecatedRules.forEach(d => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- strictNullChecks
      addArrayElementsToSet((deprecatedReplacedBy[d.ruleId] ||= new Set()), d.replacedBy);
    });

    if (lines.length > 0) {
      lines.push(separatorLine);
    }

    let firstErrorInThisFile: Linter.LintMessage | undefined;

    // create a placeholder for header
    const header: Header = {
      type: 'header',
      filePath,
      relativeFilePath: path.relative('.', filePath),
      firstLineCol: '__placeholder__:__placeholder__'
    };

    lines.push(header);

    // Shared by every message of this file; its `width` is filled in once all messages are measured.
    const align = { width: 0 };
    const messageWidths: number[] = [];
    alignments.push({ align, messageWidths });

    messages.sort(lintMessageSorter);

    for (let j = 0, messageLen = messages.length; j < messageLen; j++) {
      const x = messages[j];

      if (x.severity === 2 || x.fatal) {
        firstErrorInThisFile ||= x;
      }

      // Stylize inline code blocks
      const message = x.message.trim().replaceAll(rQuoteStyle, (m, p1, p2, p3) => picocolors.bold(p1 || p2 || p3));

      const line = String(x.line || 0);
      const column = String(x.column || 0);
      const lineWidth = fastStringWidth(line);
      const columnWidth = fastStringWidth(column);

      // eslint-disable-next-line no-useless-assignment -- prepopulate variable for type-hint and boosting performance
      let messageWidth = 0;
      if (message.includes('\n')) {
        // multi-line message, take the last line
        messageWidth = fastStringWidth(message.split('\n').pop() || message);
      } else {
        // single line message
        messageWidth = fastStringWidth(message);
      }

      if (lineWidth > maxLineWidth) {
        maxLineWidth = lineWidth;
      }

      if (columnWidth > maxColumnWidth) {
        maxColumnWidth = columnWidth;
      }

      messageWidths.push(messageWidth);

      showLineNumbers ||= x.line || x.column;

      let severity: Severity;
      if (x.fatal) {
        severity = Severity.Fatal;
      } else if (x.severity === 2) {
        severity = Severity.Error;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- never guard
      } else if (x.severity === 1) {
        severity = Severity.Warn;
      } else {
        never(x.severity, 'x.severity');
      }

      lines.push({
        type: 'message',
        severity,
        line,
        lineWidth,
        column,
        columnWidth,
        message,
        messageWidth,
        align,
        ruleId: x.ruleId || ''
      });
    };

    // if no error found, take the first message then
    firstErrorInThisFile ??= messages[0];

    header.firstLineCol = `${firstErrorInThisFile.line}:${firstErrorInThisFile.column}`;
  }

  // Width consumed by everything left of the message: leading space, severity, position and gaps.
  const reservedWidth = 1 + 5 + 1 + (showLineNumbers ? maxLineWidth + 1 + maxColumnWidth + 1 : 0) + 1;

  for (let i = 0, len = alignments.length; i < len; i++) {
    const { align, messageWidths } = alignments[i];
    align.width = resolveAlignWidth(messageWidths, reservedWidth);
  }

  let output = '\n';

  if (!isCI && process.stdout.isTTY && process.env.TERM_PROGRAM === 'iTerm.app') {
    // Make relative paths Command-clickable in iTerm
    output += iTermSetCwd();
  }

  // Since we already know `showLineNumbers` at this point, we can avoid `if` in the loop
  let renderHeaderPosition: (header: Header) => string;
  if (showLineNumbers) {
    renderHeaderPosition = (header) => picocolors.hidden(picocolors.dim(picocolors.gray(`:${header.firstLineCol}`)));
  } else {
    renderHeaderPosition = () => '';
  }
  let renderMessagePosition: (line: Line) => string;
  if (showLineNumbers) {
    renderMessagePosition = (x) => ' '.repeat(maxLineWidth - x.lineWidth) + picocolors.dim(x.line + picocolors.gray(':') + x.column);
  } else {
    renderMessagePosition = () => '';
  }

  output += fastStringArrayJoin(
    lines.map(x => {
      switch (x.type) {
        case 'header':
          return renderHeader(x, renderHeaderPosition(x));
        case 'message':
          return (
            ' ' // add a prefix whitespace for better readability under file header
            + fastStringArrayJoin([
              // severity
              severityToAnsiColoredPrefixMap[x.severity],
              // position
              renderMessagePosition(x),
              // message, then padding to align the ruleId -- messages wider than the alignment
              // column overflow it and get only the single separator space added by the join
              ' '.repeat(maxColumnWidth - x.columnWidth)
              + x.message
              + ' '.repeat(Math.max(0, x.align.width - x.messageWidth)),
              // ruleId
              renderRuleId(x.ruleId, data)
            ], ' ')
          );
        default:
          return ''; // separator
      }
    }),
    '\n'
  );
  output += '\n\n';

  const deprecatedEntries = Object.entries(deprecatedReplacedBy);
  const deprecatedCount = deprecatedEntries.length;

  // early bailout if no problems found
  if (errorCount + warningCount + fatalErrorCount + deprecatedCount <= 0) {
    return '';
  }

  const stats = ([
    ['problem', true, errorCount + warningCount + fatalErrorCount] as const,
    ['warning', true, warningCount > 0 ? picocolors.yellow(warningCount) : picocolors.green(0)] as const,
    ['error', true, errorCount > 0 ? picocolors.red(errorCount) : picocolors.green(0)] as const,
    ['fatal', fatalErrorCount > 0, picocolors.red(fatalErrorCount)] as const,
    ['fixable', fixableCount > 0, fixableCount] as const,
    // ['suppressed', suppressedCount > 0, picocolors.gray(suppressedCount)] as const,
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
      output += replacedBy.size > 0 ? picocolors.gray(` (replaced by ${fastStringArrayJoin(Array.from(replacedBy, picocolors.white), ', ')})`) : '';
    });
  }

  output += '\n';

  return output;
};

export default pretty;

function lintResultSorter(a: ESLint.LintResult, b: ESLint.LintResult): number {
  if (a.errorCount === b.errorCount) {
    return b.warningCount - a.warningCount;
  }

  if (a.errorCount === 0) return -1;
  if (b.errorCount === 0) return 1;

  return b.errorCount - a.errorCount;
}

function lintMessageSorter(a: Linter.LintMessage, b: Linter.LintMessage): number {
  if (a.fatal === b.fatal && a.severity === b.severity) {
    if (a.line === b.line) {
      return a.column < b.column ? -1 : 1; // same line, put happen earlier column first
    }

    return a.line - b.line; // put happen earlier line first
  }

  if ((a.fatal || a.severity === 2) && (!b.fatal || b.severity !== 2)) {
    return 1;
  }

  return -1;
}
