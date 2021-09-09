import { ElasticityStrategy, NamespacedObjectReference, Scale, SloCompliance, SloTarget } from '../../../../model';
import { OrchestratorClient, PolarisRuntime } from '../../../../runtime';
import { Logger } from '../../../../util';
import { HorizontalElasticityStrategyConfig, StabilizationWindowTracker } from '../../common';
import { DefaultStabilizationWindowTracker } from '../default-stabilization-window-tracker';
import { SloComplianceElasticityStrategyControllerBase } from './slo-compliance-elasticity-strategy-controller.base';

/** Tracked executions eviction interval of 20 minutes. */
const EVICTION_INTERVAL_MSEC = 20 * 60 * 1000;

/**
 * Common superclass for controller for executing an elasticity strategy that employs horizontal scaling.
 */
export abstract class HorizontalElasticityStrategyControllerBase<T extends SloTarget, C extends HorizontalElasticityStrategyConfig>
    extends SloComplianceElasticityStrategyControllerBase<T, C> {

    /** The client for accessing orchestrator resources. */
    protected orchClient: OrchestratorClient;

    /** The `PolarisRuntime` instance. */
    protected polarisRuntime: PolarisRuntime

    /** Tracks the stabilization windows of the ElasticityStrategy instances. */
    protected stabilizationWindowTracker: StabilizationWindowTracker<ElasticityStrategy<SloCompliance, T, C>> = new DefaultStabilizationWindowTracker();

    private evictionInterval: NodeJS.Timeout;

    constructor(polarisRuntime: PolarisRuntime) {
        super();
        this.polarisRuntime = polarisRuntime;
        this.orchClient = polarisRuntime.createOrchestratorClient();

        this.evictionInterval = setInterval(() => this.stabilizationWindowTracker.evictExpiredExecutions(), EVICTION_INTERVAL_MSEC);
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
        Logger.log('Executing elasticity strategy:', elasticityStrategy);

        const targetRef = new NamespacedObjectReference({
            namespace: elasticityStrategy.metadata.namespace,
            ...elasticityStrategy.spec.targetRef,
        });
        const currScale = await this.orchClient.getScale(targetRef);
        const oldReplicaCount = currScale.spec.replicas;

        const newScale = await this.computeScale(elasticityStrategy, currScale);
        newScale.spec.replicas = this.normalizeReplicaCount(newScale.spec.replicas, elasticityStrategy.spec.staticConfig);

        if (newScale.spec.replicas === oldReplicaCount) {
            Logger.log(
                'No scaling possible, because new replica count after min/max check is equal to old replica count.',
                newScale,
            );
            return;
        }

        if (!this.checkIfOutsideStabilizationWindow(elasticityStrategy, oldReplicaCount, newScale)) {
            Logger.log(
                `Skipping scaling from ${oldReplicaCount} to ${newScale.spec.replicas} replicas, because stabilization window has not yet passed for:`,
                elasticityStrategy,
            );
            return;
        }

        await this.orchClient.setScale(targetRef, newScale);
        this.stabilizationWindowTracker.trackExecution(elasticityStrategy);
        Logger.log(`Successfully updated scale subresource from ${oldReplicaCount} to ${newScale.spec.replicas} replicas for:`, elasticityStrategy);
    }

    onDestroy(): void {
        clearInterval(this.evictionInterval);
    }

    onElasticityStrategyDeleted(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): void {
        this.stabilizationWindowTracker.removeElasticityStrategy(elasticityStrategy);
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

    /**
     * @returns `true` if the upcoming scaling action is outside of the stabilization window of the `elasticityStrategy`.
     */
    private checkIfOutsideStabilizationWindow(
        elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>,
        oldReplicaCount: number,
        newScale: Scale,
    ): boolean {
        if (newScale.spec.replicas > oldReplicaCount) {
            // We want to scale out.
            return this.stabilizationWindowTracker.isOutsideStabilizationWindowForScaleUp(elasticityStrategy);
        } else {
            // We want to scale in
            return this.stabilizationWindowTracker.isOutsideStabilizationWindowForScaleDown(elasticityStrategy);
        }
    }

}
