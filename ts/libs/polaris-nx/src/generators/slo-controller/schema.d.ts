
export interface SloControllerGeneratorSchema {
    name: string;
    sloMappingTypePkg: string;
    sloMappingType: string;
    tags?: string;
    directory?: string;
}

interface SloControllerGeneratorNormalizedSchema extends SloControllerGeneratorSchema {
    projectName: string;
    projectRoot: string;
    projectDirectory: string;
    parsedTags: string[]
    appsDir: string;
    libsDir: string;
}
