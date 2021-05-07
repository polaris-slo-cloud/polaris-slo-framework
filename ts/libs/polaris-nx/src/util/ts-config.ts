/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Tree, readJson, updateJson } from '@nrwl/devkit';

const TS_CONFIG_FILES = [
    'tsconfig.base.json',
    'tsconfig.json',
];

/**
 * Adapts the global tsconfig file for use with Polaris.
 *
 * Specifically, this enables the `experimentalDecorators` compiler option.
 */
export function adaptTsConfigForPolaris(host: Tree): void {
    const tsConfigPath = getWorkspaceTsConfigPath(host);
    if (!tsConfigPath) {
        console.error('Could not find the workspace\'s global tsconfig file. ' +
            'Please activate "experimentalDecorators" in the "compilerOptions" of your tsconfig manually.');
        return;
    }

    updateJson(host, tsConfigPath, json => {
        if (json.compilerOptions) {
            json.compilerOptions.experimentalDecorators = true;
        } else {
            json.compilerOptions = { experimentalDecorators: true };
        }
        return json;
    });
}

/**
 * Checks if he specified `npmPackage` is remapped in the tsconfig `paths`.
 *
 * If it is remapped, the package's source is likely contained in the local monorepo and
 * thus, the package must not be installed through the package manager.
 *
 * @returns `true` if the specified `npmPackage` is remapped in the tsconfig `paths`, otherwise `false.
 */
export function checkIfPackageIsInPaths(host: Tree, npmPackage: string): boolean {
    const tsConfigPath = getWorkspaceTsConfigPath(host);
    if (!tsConfigPath) {
        return false;
    }

    const tsConfigJson = readJson(host, tsConfigPath);
    const mappedPaths = tsConfigJson?.compilerOptions?.paths;
    return !!mappedPaths && !!mappedPaths[npmPackage];
}

/**
 * @returns The path of the workspace's global tsconfig file or `undefined` if it cannot be found.
 */
function getWorkspaceTsConfigPath(host: Tree): string {
    return TS_CONFIG_FILES.find(path => host.exists(path));
}
