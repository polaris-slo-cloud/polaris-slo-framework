import { Tree, joinPathFragments, readProjectConfiguration } from '@nrwl/devkit';
import { namesWithSuffix } from '../../../util';
import { NormalizedSchema, SloMappingTypeGeneratorSchema } from '../schema';

const SLO_MAPPING_TYPE_SUFFIX = 'SloMapping';

export function normalizeOptions(host: Tree, options: SloMappingTypeGeneratorSchema): NormalizedSchema {
    const projectConfig = readProjectConfiguration(host, options.project);
    return {
        names: namesWithSuffix(options.name, SLO_MAPPING_TYPE_SUFFIX),
        destDir: joinPathFragments(projectConfig.sourceRoot, options.directory),
    };
}
