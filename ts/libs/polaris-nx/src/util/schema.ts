import { Tree, getWorkspaceLayout, names } from '@nrwl/devkit';
import { NormalizedNames } from './naming';

/** Common interface for all project generator schemas. */
export interface ProjectGeneratorSchema {

    /** The name of the new project. */
    name: string;

    /** Tags to be added to the project for linting. */
    tags?: string;

    /** The directory where the project should be placed. */
    directory?: string;

}

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

    /** The directory, where this project will be created, relative to the workspace root. */
    projectDirectory: string;

    /** The tags to be added to the project for linting. */
    parsedTags: string[]

}

/** Common interface for all generators that add a class to a library project. */
export interface LibraryClassGeneratorSchema {

    /** The name of the class to add. */
    name: string;

    /** The project to which the class should be added. */
    project: string;

    /** The directory within the project's src folder, where the class should be created */
    directory: string;

    /** `true` if a publishable library project should be created. */
    createLibProject: boolean;

    /** The import path of the publishable library, e.g., '@my-org/my-lib' (only used and required if `createLibProject` is `true`). */
    importPath?: string;

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

/** Normalizes a {@link ProjectGeneratorSchema} into a {@link NormalizedProjectGeneratorSchema}. */
export function normalizeProjectGeneratorOptions<T extends ProjectGeneratorSchema>(host: Tree, options: T): NormalizedProjectGeneratorSchema & T {
    const workspaceInfo = getWorkspaceLayout(host);
    const name = names(options.name).fileName;
    const projectDirectory = options.directory
        ? `${names(options.directory).fileName}/${name}`
        : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const projectRoot = `${workspaceInfo.appsDir}/${projectDirectory}`;
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];

    return {
        ...options,
        projectName,
        projectRoot,
        projectDirectory,
        parsedTags,
        appsDir: workspaceInfo.appsDir,
        libsDir: workspaceInfo.libsDir,
    };
}
