import * as path from 'path';
import { Tree, generateFiles, joinPathFragments } from '@nx/devkit';
import { SloMappingTypeGeneratorNormalizedSchema } from '../schema';

/**
 * Generates the SLO mapping type.
 */
export function addSloMappingTypeFile(host: Tree, options: SloMappingTypeGeneratorNormalizedSchema): void {
    const templateOptions = {
        ...options.sloNames,
        template: '', // Used to replace '__template__' with an empty string in file names.
    };

    generateFiles(
        host,
        path.join(__dirname, '..', 'files/slo-mapping-type'),
        joinPathFragments(options.projectSrcRoot, options.destDir),
        templateOptions,
    );
}
