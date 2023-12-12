import * as child_process from 'child_process';
import { Executor, ExecutorContext } from '@nrwl/devkit';
import { FsTree } from 'nx/src/generators/tree';

import { PolarisCliConfig, PolarisCliError } from '../../util';
import { GenerateDockerBuildExecutorSchema } from './schema';

/**
 * Runs the docker build command
 */
const executeDockerBuild: Executor<GenerateDockerBuildExecutorSchema> = (options: GenerateDockerBuildExecutorSchema, context: ExecutorContext) => {
    if (!context.projectName) {
        throw new PolarisCliError('This executor must be run on a project. No projectName found in context.', context);
    }

    const host = new FsTree(context.root, context.isVerbose);
    const polarisCliConfig = PolarisCliConfig.readFromFile(host);
    const projectConfig = polarisCliConfig.getProject(options.projectName);
    const command = 'docker';

    const args = [
        'build',
        '-f',
        `${projectConfig.dockerFilePath}`,
        '--build-arg',
        'POLARIS_APP_TYPE=slo',
        '--build-arg',
        `POLARIS_APP_NAME=${options.projectName}`,
        '-t',
        `${projectConfig.dockerImageName}:${projectConfig.dockerImageTags}`,
        '.',
    ];

    const result = child_process.spawnSync(command, args, {
        cwd: context.root,
        stdio: 'inherit',
    });
    return Promise.resolve({
        success: result.status === 0,
    });
};

export default executeDockerBuild;
