import { NormalizedNames } from '../../util';

export interface SloMappingTypeGeneratorSchema {
    name: string;
    project: string;
    directory: string;
}

export interface NormalizedSchema {
    names: NormalizedNames;
    destDir: string;
}
