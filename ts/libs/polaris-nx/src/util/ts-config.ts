/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Tree, updateJson } from '@nrwl/devkit';

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
 * @returns The path of the workspace's global tsconfig file or `undefined` if it cannot be found.
 */
function getWorkspaceTsConfigPath(host: Tree): string {
    return TS_CONFIG_FILES.find(path => host.exists(path));
}
