import { Tree } from '@nx/devkit';
import { ProjectConfig } from './project-config';
import { NormalizedProjectGeneratorSchema } from './schema';

/**
 * Generates the Dockerfile command to copy the libs directory, if it exists.
 */
export function generateDockerfileCopyLibs(host: Tree, libsDir: string): string {
    if (libsDir && host.exists(libsDir)) {
        return `COPY ./${libsDir} ./${libsDir}`;
    }
    return '';
}

/**
 * Generates the Dockerfile command to copy the workspace configuration files.
 */
export function generateDockerfileCopyWorkspaceConfig(host: Tree): string {
    let files = 'nx.json package.json tsconfig.base.json';

    const appendIfExists: (fileName: string) => void = (fileName: string) => {
        if (host.exists(fileName)) {
            files += ` ${fileName}`;
        }
    };

    appendIfExists('package-lock.json');
    appendIfExists('.npmrc');
    appendIfExists('yarn.lock');
    appendIfExists('.yarnrc.yml');
    appendIfExists('.pnpmfile.cjs');
    appendIfExists('pnpm-lock.yaml');
    appendIfExists('pnpm-workspace.yaml');
    appendIfExists('angular.json');
    appendIfExists('decorate-angular-cli.js');
    appendIfExists('workspace.json');
    appendIfExists('jest.config.ts');
    appendIfExists('jest.preset.js');

    return `COPY ${files} ./`;
}

/**
 * Generates the Dockerfile command to install npm packages.
 */
export function generateDockerfilePackageInstallCmd(host: Tree): string {
    if (host.exists('yarn.lock')) {
        return 'RUN yarn install --non-interactive';
    }
    if (host.exists('pnpm-lock.yaml')) {
        return 'RUN npm install -g pnpm && pnpm install';
    }
    return 'RUN npm ci --unsafe-perm';
}

/**
 * Adds a `docker-build` target to the project's configuration.
 */
export function addDockerBuildConfig(projectConfig: ProjectConfig, options: NormalizedProjectGeneratorSchema): void {
    projectConfig.targets['docker-build'] = {
        executor: 'nx:run-commands',
        options: {
            commands: [
                // eslint-disable-next-line max-len
                `docker build -f ./${options.projectRoot}/Dockerfile --build-arg POLARIS_APP_TYPE=slo --build-arg POLARIS_APP_NAME=${options.projectName} -t ${getContainerImageName(options)}:latest .`,
            ],
            parallel: false,
        },
    };
}

/**
 * Generates the name of the container image for this controller.
 */
export function getContainerImageName(options: NormalizedProjectGeneratorSchema): string {
    return `polarissloc/${options.projectName}`;
}
