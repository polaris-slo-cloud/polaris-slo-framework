import { Tree, getProjects, updateProjectConfiguration } from '@nx/devkit';

export default function updateDockerBuildCommand(tree: Tree) {
    const projects = getProjects(tree);

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
    }
}
