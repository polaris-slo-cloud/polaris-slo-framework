import { Tree, joinPathFragments, names, readProjectConfiguration } from '@nrwl/devkit';
import { SloMappingTypeGeneratorNormalizedSchema, SloMappingTypeGeneratorSchema } from '../schema';

const SLO_MAPPING_TYPE_FILE_SUFFIX = '.slo-mapping'

export function normalizeOptions(host: Tree, options: SloMappingTypeGeneratorSchema): SloMappingTypeGeneratorNormalizedSchema {
    const projectConfig = readProjectConfiguration(host, options.project);
    const normalizedNames = names(options.name);

    return {
        names: normalizedNames,
        projectSrcRoot: projectConfig.sourceRoot,
        destDir: joinPathFragments('lib', options.directory),
        fileNameWithSuffix: normalizedNames.fileName + SLO_MAPPING_TYPE_FILE_SUFFIX,
    };
}
