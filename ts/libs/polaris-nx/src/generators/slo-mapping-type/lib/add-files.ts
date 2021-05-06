import * as path from 'path';
import { Tree, generateFiles } from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';

const SLO_MAPPING_TYPE_FILE_SUFFIX = '.slo-mapping'

export function addFiles(host: Tree, options: NormalizedSchema): void {
    const templateOptions = {
        className: options.names.className,
        fileName: options.names.fileName + SLO_MAPPING_TYPE_FILE_SUFFIX,
        template: '', // Used to replace '__template__' with an empty string in file names.
    };

    generateFiles(host, path.join(__dirname, '..', 'files'), options.destDir, templateOptions);
}
