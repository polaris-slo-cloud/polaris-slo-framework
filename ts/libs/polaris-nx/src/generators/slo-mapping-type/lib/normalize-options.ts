import { Tree, joinPathFragments, names, readProjectConfiguration } from '@nrwl/devkit';
import { getProjectSrcRoot, getSloNames } from '../../../util';
import { SloMappingTypeGeneratorNormalizedSchema, SloMappingTypeGeneratorSchema } from '../schema';

export function normalizeOptions(host: Tree, options: SloMappingTypeGeneratorSchema): SloMappingTypeGeneratorNormalizedSchema {
    const projectConfig = readProjectConfiguration(host, options.project);
    const normalizedNames = names(options.name);
    const sloNames = getSloNames(normalizedNames.className);

    return {
        names: normalizedNames,
        className: sloNames.sloMappingType,
        projectName: options.project,
        projectSrcRoot: getProjectSrcRoot(projectConfig),
        destDir: joinPathFragments('lib', options.directory),
        destDirInLib: options.directory,
        fileName: sloNames.sloMappingFileName,
        sloNames,
    };
}
