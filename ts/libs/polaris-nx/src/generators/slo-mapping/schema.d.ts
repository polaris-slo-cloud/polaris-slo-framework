import { NormalizedNames } from '../../util';

export interface SloMappingGeneratorSchema {
    name: string;
    sloMappingTypePkg: string;
    sloMappingType: string;
    directory?: string;
}

export interface SloMappingGeneratorNormalizedSchema extends SloMappingGeneratorSchema {
    names: NormalizedNames
    destDir: string;
}
