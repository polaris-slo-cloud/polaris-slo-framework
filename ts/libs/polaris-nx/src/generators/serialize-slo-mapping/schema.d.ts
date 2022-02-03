export interface SerializeSloMappingGeneratorSchema {
    sloMappingTsPath: string;
}

export interface SerializeSloMappingGeneratorNormalizedSchema extends SerializeSloMappingGeneratorSchema {
    fullSloMappingTsPath: string;
    sloMappingPathWithoutExtension: string;
    fullSloMappingPathWithoutExtension: string;
}
