import { GeneratorCallback, NxJsonProjectConfiguration, ProjectConfiguration, Tree, readProjectConfiguration } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/node';
import { NormalizedLibraryClassGeneratorSchema, NormalizedProjectGeneratorSchema } from './schema';
import { adaptLibModuleTypeForPolaris } from './ts-config';

/** Configuration for a project within an Nx CLI workspace. */
export type ProjectConfig = ProjectConfiguration & NxJsonProjectConfiguration;

/** Parameters for creating a library project. */
export interface LibProjectOptions {
    projectName: string;
    importPath: string;
}

/**
 * Changes the build configuration to bundle all external dependencies into the output js file.
 */
export function changeBuildDependencyBundling(projectConfig: ProjectConfig): void {
    const options = projectConfig.targets['build'].options as { externalDependencies: 'none' | 'all' | string[] };
    options.externalDependencies = 'none';
}

/**
 * Adds a `deploy` target to the project's configuration to allow deploying the controller to an orchestrator.
 */
export function addDeployTarget(projectConfig: ProjectConfig, options: NormalizedProjectGeneratorSchema): void {
    projectConfig.targets['deploy'] = {
        executor: '@nrwl/workspace:run-commands',
        options: {
            commands: [
                // Allows specifying the destination context, but if user does not specify the destination, its string value is 'undefined'
                // `kubectl apply --context='{args.destination}' -f ./${options.projectRoot}/manifests/kubernetes`,
                `kubectl apply -f ./${options.projectRoot}/manifests/kubernetes`,
            ],
            parallel: false,
        },
    };
}

/**
 * Adds a `gen-crds` target to the library project's configuration.
 */
export function addGenCrdsTarget(projectConfig: ProjectConfig, options: NormalizedLibraryClassGeneratorSchema): void {
    if (!projectConfig.targets['gen-crds']) {
        projectConfig.targets['gen-crds'] = {
            executor: '@polaris-sloc/polaris-nx:generate-crds',
            options: {},
        };
    }
}

/**
 * Creates a new library project.
 *
 * Throws an error if the project already exists.
 */
export async function createLibProject(host: Tree, options: LibProjectOptions): Promise<GeneratorCallback> {
    let projectExists = false;
    try {
        projectExists = !!readProjectConfiguration(host, options.projectName);
    } catch (e) {}
    if (projectExists) {
        throw new Error(`Cannot create a new library project, because a project with the name ${options.projectName} already exists.`);
    }

    const ret = await libraryGenerator(
        host, {
            name: options.projectName,
            publishable: true,
            importPath: options.importPath,
        },
    );

    adaptLibModuleTypeForPolaris(host, options.projectName);
    return ret;
}
