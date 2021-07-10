import * as path from 'path';
import { Tree, generateFiles } from '@nrwl/devkit';
import {
    NormalizedProjectGeneratorSchema,
    generateDockerfileCopyLibs,
    generateDockerfileCopyWorkspaceConfig,
    generateDockerfilePackageInstallCmd,
} from '../../util';

export interface TypeScriptDockerTemplateOptions {
    appsDir: string;
    copyWorkspaceFilesCmd: string;
    pkgInstallCmd: string;
    copyLibsDirCmd: string;
    template: '';
}

/**
 * Generates the Dockerfile for a TypeScript controller project.
 */
export function generateTypeScriptDockerfile(host: Tree, options: NormalizedProjectGeneratorSchema): void {
    const templateOptions: TypeScriptDockerTemplateOptions = {
        appsDir: options.appsDir,
        copyWorkspaceFilesCmd: generateDockerfileCopyWorkspaceConfig(host),
        pkgInstallCmd: generateDockerfilePackageInstallCmd(host),
        copyLibsDirCmd: generateDockerfileCopyLibs(host, options.libsDir),
        template: '',
    };
    generateFiles(host, path.join(__dirname, 'files/ts-docker'), options.projectRoot, templateOptions);
}
