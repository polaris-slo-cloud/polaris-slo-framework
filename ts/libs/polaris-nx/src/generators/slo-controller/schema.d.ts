import { NormalizedProjectGeneratorSchema } from '../../util';

export interface SloControllerGeneratorSchema {
    name: string;
    sloMappingTypePkg: string;
    sloMappingType: string;
    tags?: string;
    directory?: string;
}

interface SloControllerGeneratorNormalizedSchema extends NormalizedProjectGeneratorSchema, SloControllerGeneratorSchema {
    projectDirectory: string;
    parsedTags: string[]
    appsDir: string;
    libsDir: string;
}
