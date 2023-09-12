export interface ApplySloMappingGeneratorSchema {
    sloMappingTsPath: string;
}

export interface ApplySloMappingGeneratorNormalizedSchema extends ApplySloMappingGeneratorSchema {
    fullSloMappingTsPath: string;
    sloMappingPathWithoutExtension: string;
    fullSloMappingPathWithoutExtension: string;
}
