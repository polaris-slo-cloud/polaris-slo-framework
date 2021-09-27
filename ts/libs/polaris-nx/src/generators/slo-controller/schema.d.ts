import { NormalizedProjectGeneratorSchema, ProjectGeneratorSchema } from '../../util';

export interface SloControllerGeneratorSchema extends ProjectGeneratorSchema {
    sloMappingTypePkg: string;
    sloMappingType: string;
}

interface SloControllerGeneratorNormalizedSchema extends NormalizedProjectGeneratorSchema, SloControllerGeneratorSchema {}
