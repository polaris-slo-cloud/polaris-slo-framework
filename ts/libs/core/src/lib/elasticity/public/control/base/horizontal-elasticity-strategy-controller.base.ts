import { ElasticityStrategy, NamespacedObjectReference, Scale, SloCompliance, SloTarget } from '../../../../model';
import { OrchestratorClient, PolarisRuntime } from '../../../../runtime';
import { HorizontalElasticityStrategyConfig } from '../../common';
import { SloComplianceElasticityStrategyControllerBase } from './slo-compliance-elasticity-strategy-controller.base';

/**
 * Common superclass for controller for executing an elasticity strategy that employs horizontal scaling.
 */
export abstract class HorizontalElasticityStrategyControllerBase<T extends SloTarget, C extends HorizontalElasticityStrategyConfig>
    extends SloComplianceElasticityStrategyControllerBase<T, C> {

    /** The client for accessing orchestrator resources. */
    protected orchClient: OrchestratorClient;

    /** The `PolarisRuntime` instance. */
    protected polarisRuntime: PolarisRuntime

    constructor(polarisRuntime: PolarisRuntime) {
        super();
        this.polarisRuntime = polarisRuntime;
        this.orchClient = polarisRuntime.createOrchestratorClient();
    }

    /**
     * Computes the new number of replicas according to the the `elasticityStrategy` instance.
     *
     * The resulting new replica count will be normalized using the min/max allowed replicas by the
     * caller of this method.
     *
     * @param elasticityStrategy The current elasticity strategy instance.
     * @param currScale The current state of the target workload's `Scale` subresource.
     * @returns A promise that resolves to a `Scale` object that contains the new number of replicas.
     */
    protected abstract computeScale(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>, currScale: Scale): Promise<Scale>;

    async execute(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): Promise<void> {
        console.log('Executing elasticity strategy:', elasticityStrategy);

        const targetRef = new NamespacedObjectReference({
            namespace: elasticityStrategy.metadata.namespace,
            ...elasticityStrategy.spec.targetRef,
        });
        const currScale = await this.orchClient.getScale(targetRef);
        const oldReplicaCount = currScale.spec.replicas;

        const newScale = await this.computeScale(elasticityStrategy, currScale);
        newScale.spec.replicas = this.normalizeReplicaCount(newScale.spec.replicas, elasticityStrategy.spec.staticConfig);

        if (newScale.spec.replicas === oldReplicaCount) {
            console.log(
                'No scaling possible, because new replica count after min/max check is equal to old replica count.',
                newScale,
            );
        }

        await this.orchClient.setScale(targetRef, newScale);
        console.log('Successfully updated scale subresource:', newScale);
    }

    /**
     * @returns `config?.minReplicas`, if it is set, or, otherwise, the default min replicas value.
     */
    protected getMinReplicas(config: C): number {
        return config?.minReplicas ?? 1;
    }

    /**
     * @returns `config?.maxReplicas`, if it is set, or, otherwise, the default max replicas value.
     */
    protected getMaxReplicas(config: C): number {
        return config?.maxReplicas ?? Infinity;
    }

    /**
     * Normalizes the `newReplicaCount` to be within the min/max range from the `config`.
     */
    private normalizeReplicaCount(newReplicaCount: number, config: C): number {
        newReplicaCount = Math.max(newReplicaCount, this.getMinReplicas(config));
        newReplicaCount = Math.min(newReplicaCount, this.getMaxReplicas(config));
        return newReplicaCount;
    }

}
