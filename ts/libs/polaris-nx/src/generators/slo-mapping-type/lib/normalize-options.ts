import { Tree, joinPathFragments, names, readProjectConfiguration } from '@nrwl/devkit';
import { getSloNames } from '../../../util';
import { SloMappingTypeGeneratorNormalizedSchema, SloMappingTypeGeneratorSchema } from '../schema';

export function normalizeOptions(host: Tree, options: SloMappingTypeGeneratorSchema): SloMappingTypeGeneratorNormalizedSchema {
    const projectConfig = readProjectConfiguration(host, options.project);
    const normalizedNames = names(options.name);
    const sloNames = getSloNames(normalizedNames.className);

    return {
        names: normalizedNames,
        className: `${normalizedNames.className}SloMapping`,
        projectName: options.project,
        projectSrcRoot: projectConfig.sourceRoot,
        destDir: joinPathFragments('lib', options.directory),
        destDirInLib: options.directory,
        fileName: sloNames.sloMappingFileName,
    };
}
