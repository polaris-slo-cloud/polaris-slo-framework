import { Executor, ExecutorContext } from '@nrwl/devkit';
import { loadAll, dump } from 'js-yaml';
import { isMatch } from 'lodash';

import { PolarisCliError } from '../../util';
import { DeployExecutorSchema } from './schema';
import { readFile } from 'fs/promises';
import { apply, createKubeConfig, getClusterRoleBindingFromManifest, getClusterRoleFromManifest, getDeployedClusterRole, getDeployedClusterRoleBinding } from '../../util/kubernetes';

/**
 * Deploys a Polaris project or an SLO Mapping to an orchestrator.
 */
const executeDeploy: Executor<DeployExecutorSchema> = async (options: DeployExecutorSchema, context: ExecutorContext) => {
    if (!context.projectName) {
        throw new PolarisCliError('This executor must be run on a project. No projectName found in context.', context);
    }

    const manifestPath = `./apps/${context.projectName}/manifests/kubernetes/1-rbac.yaml`
    const manifestContent = await readFile(manifestPath);
    const manifest = loadAll(manifestContent.toString());

    const clusterRole = getClusterRoleFromManifest(manifest);
    const clusterRoleBinding = getClusterRoleBindingFromManifest(manifest);

    if (!clusterRole) {
        throw new PolarisCliError('No ClusterRole object found in the manifest.');
    }

    if (!clusterRoleBinding) {
        throw new PolarisCliError('No ClusterRoleBinding object found in the manifest.');
    }

    const kubeConfig = createKubeConfig();
    const deployedClusterRole = await getDeployedClusterRole(clusterRole.metadata.name, kubeConfig);
    const deployedClusterRoleBinding = await getDeployedClusterRoleBinding(clusterRoleBinding.metadata.name, kubeConfig);

    if (deployedClusterRole && deployedClusterRoleBinding) {
        // Check if the ClusterRole and ClusterRoleBinding in the manifest are equal to the ones deployed in the cluster.
        if (!isMatch(deployedClusterRole, clusterRole)) {
            throw new PolarisCliError('The ClusterRole object found in the manifest does not match the one deployed in the cluster.');
        } else if (!isMatch(deployedClusterRoleBinding, clusterRoleBinding)) {
            throw new PolarisCliError('The ClusterRoleBinding object found in the manifest does not match the one deployed in the cluster.');
        }

        // Remove the ClusterRole and ClusterRoleBinding from the manifest, so that they are not deployed again.
        manifest.splice(manifest.indexOf(clusterRole), 1);
        manifest.splice(manifest.indexOf(clusterRoleBinding), 1);
    }

    try {
        await apply(createKubeConfig(), dump(manifest, { indent: 2 }));
    } catch (e) {
        throw new PolarisCliError('An error occured during deployment:', e.body ?? e.message);
    }

    return {
        success: true,
    };
};

export default executeDeploy;
