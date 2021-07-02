
/** Common interface for all normalized generator parameter schemas.  */
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
