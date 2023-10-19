import { Tree, getProjects, updateProjectConfiguration } from '@nx/devkit';

export default function updateDeployCommand(tree: Tree) {
    const projects = getProjects(tree);

    for (const [name, project] of projects) {
      if (
        project.targets?.['deploy']?.executor === 'nx:run-commands'
      ) {
        project.targets['deploy'] = {
            executor: '@polaris-sloc/polaris-nx:deploy',
            options: {
                projectName: name,
            },
        };
        updateProjectConfiguration(tree, name, project);
      }
    }
}
