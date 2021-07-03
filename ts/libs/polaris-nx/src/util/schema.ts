import { NormalizedNames } from './naming';

/** Common interface for all normalized schemas for project generators.  */
export interface NormalizedProjectGeneratorSchema {

    /** The name of the new project. */
    projectName: string;

    /** The root directory of the project, relative to the workspace root. */
    projectRoot: string;

    /** The directory, where app projects are stored, relative to the workspace root. */
    appsDir: string;

    /** The directory, where library projects are stored, relative to the workspace root. */
    libsDir: string;

}

/**
 * Common interface for all normalized schemas for generators that add a class to a library project.
 */
export interface NormalizedLibraryClassGeneratorSchema {

    /** The normalized names relevant for the generated class. */
    names: NormalizedNames;

    /** The name of the class with suffix already attached. */
    className: string;

    /** The name of the class' file with any suffix already attached, but without the file extension. */
    fileName: string;

    /** The name of library project. */
    projectName: string;

    /** The path of the project's src root directory. */
    projectSrcRoot: string;

    /** The destination path for the class' file relative to `projectSrcRoot`. */
    destDir: string;

    /** The destination path for the class' file relative to the lib directory within `projectSrcRoot`. */
    destDirInLib: string;

}
