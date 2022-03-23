import { KubeConfig, KubernetesObjectApi } from '@kubernetes/client-node';
import { ObjectKindWatcher, OrchestratorClient, PolarisRuntimeBase, SloEvaluator } from '@polaris-sloc/core';
import { KubernetesSloEvaluator } from '../../slo';
import { KubernetesOrchestratorClient } from './orchestrator-client';
import { KubernetesObjectKindWatcher } from './watch';

export class KubernetesPolarisRuntime extends PolarisRuntimeBase {

    constructor(private kubeConfig: KubeConfig) {
        super();
    }

    createSloEvaluator(): SloEvaluator {
        const k8sClient = KubernetesObjectApi.makeApiClient(this.kubeConfig);
        return new KubernetesSloEvaluator(this, k8sClient);
    }

    createObjectKindWatcher(): ObjectKindWatcher {
        return new KubernetesObjectKindWatcher(this.kubeConfig, this.transformer);
    }

    createOrchestratorClient(): OrchestratorClient {
        return new KubernetesOrchestratorClient(this, this.kubeConfig);
    }

}
