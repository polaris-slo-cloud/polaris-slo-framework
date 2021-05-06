import { Tree, joinPathFragments, names, readProjectConfiguration } from '@nrwl/devkit';
import { NormalizedSchema, SloMappingTypeGeneratorSchema } from '../schema';

export function normalizeOptions(host: Tree, options: SloMappingTypeGeneratorSchema): NormalizedSchema {
    const projectConfig = readProjectConfiguration(host, options.project);
    return {
        names: names(options.name),
        destDir: joinPathFragments(projectConfig.sourceRoot, 'lib', options.directory),
    };
}
