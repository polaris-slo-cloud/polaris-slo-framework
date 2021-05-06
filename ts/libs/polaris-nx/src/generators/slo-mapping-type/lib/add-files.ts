import * as path from 'path';
import { Tree, generateFiles, joinPathFragments } from '@nrwl/devkit';
import { SloMappingTypeGeneratorNormalizedSchema } from '../schema';

export function addFiles(host: Tree, options: SloMappingTypeGeneratorNormalizedSchema): void {
    const templateOptions = {
        className: options.names.className,
        fileName: options.fileNameWithSuffix,
        template: '', // Used to replace '__template__' with an empty string in file names.
    };

    generateFiles(
        host,
        path.join(__dirname, '..', 'files'),
        joinPathFragments(options.projectSrcRoot, options.destDir),
        templateOptions,
    );
}
