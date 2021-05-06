import { NormalizedNames } from '../../util';

export interface SloMappingTypeGeneratorSchema {
    name: string;
    project: string;
    directory: string;
}

export interface SloMappingTypeGeneratorNormalizedSchema {
    names: NormalizedNames;

    /** The path of the project's src root directory. */
    projectSrcRoot: string;

    /** The destination path for the SLO mapping file relative to `projectSrcRoot`. */
    destDir: string;

    /** The name of the SLO mapping file with the .slo-mapping suffix, but without the file extension. */
    fileNameWithSuffix: string;

}
