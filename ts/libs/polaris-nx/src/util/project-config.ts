import { NxJsonProjectConfiguration, ProjectConfiguration } from '@nrwl/devkit';
import { NormalizedProjectGeneratorSchema } from './schema';

/** Configuration for a project within an Nx CLI workspace. */
export type ProjectConfig = ProjectConfiguration & NxJsonProjectConfiguration;

/**
 * Changes the build configuration to bundle all external dependencies into the output js file.
 */
export function changeBuildDependencyBundling(projectConfig: ProjectConfig): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    projectConfig.targets['build'].options['externalDependencies'] = 'none';
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
