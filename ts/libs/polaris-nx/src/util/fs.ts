import * as path from 'path';
import { joinPathFragments } from '@nx/devkit';

/** Joins the path fragments and returns them as a normalized Unix path. */
export function joinPathFragmentsAndNormalize(...fragments: string[]): string {
    return path.posix.normalize(joinPathFragments(...fragments));
}

/**
 * @returns The path of a temporary directory (relative to the workspace root) for the
 * specified `projectName` and `task`.
 */
export function getTempDir(projectName: string, task: string): string {
    return `tmp/${projectName}/${task}`;
}
