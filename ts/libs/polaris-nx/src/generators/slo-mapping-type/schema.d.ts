import { LibraryClassGeneratorSchema, NormalizedLibraryClassGeneratorSchema, SloNames } from '../../util';

export interface SloMappingTypeGeneratorSchema extends LibraryClassGeneratorSchema {}

export interface SloMappingTypeGeneratorNormalizedSchema extends NormalizedLibraryClassGeneratorSchema {
    sloNames: SloNames;
}
