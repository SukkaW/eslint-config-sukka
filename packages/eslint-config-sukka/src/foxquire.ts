import { isCI } from 'ci-info';
import { isPackageExists } from 'local-pkg';
import process from 'node:process';

export const foxquire = async <T>(pkg: string): Promise<T> => {
  if (
    !isCI
    && process.stdout.isTTY
    && !isPackageExists(pkg)
  ) {
    const { confirm } = await import('@clack/prompts');
    const result = await confirm({
      message: `Package is required for this config: ${pkg}. Do you want to install it?`
    });
    if (result) {
      await import('@antfu/install-pkg').then(i => i.installPackage(pkg, { dev: true }));
    };
  }

  return foximport<T>(pkg);
};
