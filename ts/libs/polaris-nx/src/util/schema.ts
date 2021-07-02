
/** Common interface for all normalized generator parameter schemas.  */
export interface NormalizedProjectGeneratorSchema {

    /** The name of the new project. */
    projectName: string;

    /** The root directory of the project, relative to the workspace root. */
    projectRoot: string;

}
