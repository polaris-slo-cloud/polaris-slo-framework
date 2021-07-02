import * as path from 'path';
import { Tree, generateFiles } from '@nrwl/devkit';

/**
 * Adds files to the workspace's root directory, which are required by multiple project types.
 */
export function addCommonWorkspaceRootFiles(host: Tree): void {
    if (!host.exists('.dockerignore')) {
        const templateOptions = {
            template: '',
        };
        generateFiles(host, path.join(__dirname, 'files/workspace-root'), '.', templateOptions);
    }
}
