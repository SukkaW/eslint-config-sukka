import { isCI } from 'ci-info';

export function isInEditorEnv(): boolean {
  if (
    // is in CI
    isCI
    // is in git hooks or lint-staged
    || process.env.GIT_PARAMS
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
