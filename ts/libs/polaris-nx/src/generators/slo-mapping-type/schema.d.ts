export interface SloMappingTypeGeneratorSchema {
    name: string;
    project: string;
    directory: string;
}

export interface NormalizedSchema extends SloMappingTypeGeneratorSchema {
    projectName: string;
    projectRoot: string;
    projectDirectory: string;
}
