import { isCI } from 'ci-info';

export function isInEditorEnv(): boolean {
  if (process.env.CI || isCI) return false;

  // is in git hooks or lint-staged
  if (
    process.env.GIT_PARAMS
    || process.env.VSCODE_GIT_COMMAND
    || process.env.npm_lifecycle_script?.startsWith('lint-staged')
  ) return false;

  // is in editor
  return !!(
    process.env.VSCODE_PID
    || process.env.VSCODE_CWD
    || process.env.JETBRAINS_IDE
    || process.env.VIM
    || process.env.NVIM
  );
}
