import { KubernetesObject, KubernetesObjectApi } from '@kubernetes/client-node';
import { ApiObject, SloEvaluatorBase, SloOutput, SlocRuntime } from '@polaris-sloc/core';
import { KubernetesObjectWithSpec } from '../../model';

export class KubernetesSloEvaluator extends SloEvaluatorBase {

    constructor(
        private slocRuntime: SlocRuntime,
        private k8sClient: KubernetesObjectApi,
    ) {
        super();
    }

    onAfterEvaluateSlo(key: string, currContext: never, sloOutput: SloOutput<any>): Promise<void> {
        const elasticityStrategyName = `${key}-elasticity-strategy`
        const elasticityStrategy = this.slocRuntime.elasticityStrategyService.fromSloOutput(elasticityStrategyName, sloOutput);
        const k8sElasticityStrat = this.transformToKubernetesObject(elasticityStrategy);

        console.log(`SLO ${k8sElasticityStrat.metadata.name}: Applying elasticityStrategy`, k8sElasticityStrat);
        return this.k8sClient.create(
            k8sElasticityStrat,
        ).catch(err => {
            console.log('Create resource failed, trying to replace the resource');
            return this.updateExistingElasticityStrategy(k8sElasticityStrat);
        }).then(
            () => console.log('Resource successfully created/replaced'),
        );
    }

    private transformToKubernetesObject(obj: ApiObject<any>): KubernetesObjectWithSpec<any> {
        return this.slocRuntime.transformer.transformToOrchestratorPlainObject(obj) as KubernetesObjectWithSpec<any>;
    }

    private async updateExistingElasticityStrategy(newSpec: KubernetesObjectWithSpec<any>): Promise<void> {
        const readReq: KubernetesObject = {
            apiVersion: newSpec.apiVersion,
            kind: newSpec.kind,
            metadata: { ...newSpec.metadata },
        };
        const readResponse = await this.k8sClient.read(readReq);
        const currStrategyData = readResponse.body;

        const newStrategyData = { ...newSpec };
        delete newStrategyData.metadata;
        const update = {
            ...currStrategyData,
            ...newStrategyData,
        };

        await this.k8sClient.replace(update);
    }

}
