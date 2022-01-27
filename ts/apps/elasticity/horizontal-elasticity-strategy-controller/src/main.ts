import { KubeConfig } from '@kubernetes/client-node';
import { HorizontalElasticityStrategyKind, initPolarisLib as initCommonMappingsLib } from '@polaris-sloc/common-mappings';
import { Logger } from '@polaris-sloc/core';
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import { HorizontalElasticityStrategyController } from './app/horizontal-elasticity-strategy';

// ToDo: It should be possible to build the elasticity strategy controller easily for multiple orchestrators.

// Load the KubeConfig and initialize the @polaris-sloc/kubernetes library.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);

// Initialize the used Polaris mapping libraries
initCommonMappingsLib(polarisRuntime);

// Create an ElasticityStrategyManager and watch the supported elasticity strategy kinds.
const manager = polarisRuntime.createElasticityStrategyManager();
manager.startWatching({
    kindsToWatch: [
        { kind: new HorizontalElasticityStrategyKind(), controller: new HorizontalElasticityStrategyController(polarisRuntime) },
    ],
}).catch(error => {
    Logger.error(error);
    process.exit(1);
});
