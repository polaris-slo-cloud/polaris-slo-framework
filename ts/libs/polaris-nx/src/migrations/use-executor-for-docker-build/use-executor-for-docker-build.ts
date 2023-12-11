import { Tree, getProjects, updateProjectConfiguration } from '@nx/devkit';
import { PolarisCliConfig } from '../../util';
import { PolarisCliProjectType } from '../../util/polaris-cli-config-data';

export default function updateDockerBuildCommand(tree: Tree) {
    const projects = getProjects(tree);
    const polarisCliConfig = PolarisCliConfig.readFromFile(tree);

    for (const [name, project] of projects) {
        if (
            project.targets?.['docker-build']?.executor === 'nx:run-commands'
        ) {
            project.targets['docker-build'] = {
                executor: '@polaris-sloc/polaris-nx:docker-build',
                options: {
                    projectName: name,
                },
            };
            updateProjectConfiguration(tree, name, project);
        }

        if (project.projectType !== PolarisCliProjectType.Library) {
            polarisCliConfig.data.projects[name].dockerFilePath = `${project.root}/Dockerfile`;
            polarisCliConfig.data.projects[name].dockerImageName = name;
            polarisCliConfig.data.projects[name].dockerImageTags = 'latest';
        }
    }

    polarisCliConfig.writeToFile();
}
