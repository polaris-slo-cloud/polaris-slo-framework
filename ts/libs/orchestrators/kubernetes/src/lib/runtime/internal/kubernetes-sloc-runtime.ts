import { KubeConfig, KubernetesObjectApi } from '@kubernetes/client-node';
import { ObjectKindWatcher, PolarisRuntimeBase, SloEvaluator } from '@polaris-sloc/core';
import { KubernetesSloEvaluator } from '../../slo';
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

}
