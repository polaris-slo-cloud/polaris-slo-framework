import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursive function that walks back up the directory
 * tree to try and find a workspace file.
 *
 * @note This is an adapted version of the same function from the Nx CLI, which is licensed under the MIT license.
 * Original implementation: https://github.com/nrwl/nx/blob/master/packages/cli/lib/find-workspace-root.ts
 *
 * @param dir Directory to start searching with
 * @returns The path of the workspace root directory or `undefined` if indication of
 * a workspace is found until reaching the file system's root directory.
 */
export function findWorkspaceRoot(dir: string): string | undefined {
    if (fs.existsSync(path.join(dir, 'angular.json'))) {
        return dir;
    }

    if (fs.existsSync(path.join(dir, 'nx.json'))) {
        return dir;
    }

    if (path.dirname(dir) === dir) {
        return undefined;
    }

    return findWorkspaceRoot(path.dirname(dir));
}
