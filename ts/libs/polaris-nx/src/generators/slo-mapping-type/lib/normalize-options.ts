import { Tree, joinPathFragments, names, readProjectConfiguration } from '@nrwl/devkit';
import { SloMappingTypeGeneratorNormalizedSchema, SloMappingTypeGeneratorSchema } from '../schema';

const SLO_MAPPING_TYPE_FILE_SUFFIX = '.slo-mapping'

export function normalizeOptions(host: Tree, options: SloMappingTypeGeneratorSchema): SloMappingTypeGeneratorNormalizedSchema {
    const projectConfig = readProjectConfiguration(host, options.project);
    const normalizedNames = names(options.name);

    return {
        names: normalizedNames,
        className: `${normalizedNames.className}SloMapping`,
        projectName: options.project,
        projectSrcRoot: projectConfig.sourceRoot,
        destDir: joinPathFragments('lib', options.directory),
        destDirInLib: options.directory,
        fileName: normalizedNames.fileName + SLO_MAPPING_TYPE_FILE_SUFFIX,
    };
}
