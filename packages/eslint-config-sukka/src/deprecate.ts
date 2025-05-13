import { isPackageExists } from '@eslint-sukka/shared';
import { isCI } from 'ci-info';
import picocolors from 'picocolors';

export async function deprecate(pkg: string) {
  if (!isPackageExists(pkg)) {
    return;
  }

  // eslint-disable-next-line no-console -- in cli warn
  console.error(picocolors.yellow(`[eslint-config-sukka] "${pkg}" is deprecated and you should uninstall it`));

  if (isCI || !process.stdout.isTTY) {
    throw new Error(`[eslint-config-sukka] "${pkg}" is deprecated and you should uninstall it`);
  }

  const { confirm } = await import('@clack/prompts');
  const result = await confirm({
    message: ` "${pkg}" is deprecated. Do you want to uninstall it?`
  });
  if (result) {
    await import('@antfu/install-pkg').then(i => i.uninstallPackage(pkg, { dev: true }));
  };
}
