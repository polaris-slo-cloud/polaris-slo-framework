import { DefaultStabilizationWindowTracker } from '../';
import { ApiObjectMetadata, Container, ElasticityStrategy, ObjectKind, PodTemplateContainer, Resources, SloCompliance, SloTarget } from '../../../../model';
import { OrchestratorClient, PolarisRuntime } from '../../../../runtime';
import { ElasticityStrategyExecutionError, StabilizationWindowTracker, VerticalElasticityStrategyConfig } from '../../common';
import { SloComplianceElasticityStrategyControllerBase } from './slo-compliance-elasticity-strategy-controller.base';

/** Tracked executions eviction interval of 20 minutes. */
const EVICTION_INTERVAL_MSEC = 20 * 60 * 1000;

/**
 * Common superclass for controller for executing an elasticity strategy that employs vertical scaling.
 */
export abstract class VerticalElasticityStrategyControllerBase<T extends SloTarget, C extends VerticalElasticityStrategyConfig>
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
     * Computes the new resources for the specified `container` using the configuration from the `elasticityStrategy` instance.
     *
     * @param elasticityStrategy The current elasticity strategy instance.
     * @param container The container, for which to compute the resources.
     * @returns A promise that resolves to the new resources that should be configured for the container.
     */
    abstract computeResources(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>, container: Container): Promise<Resources>;

    async execute(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): Promise<void> {
        console.log('Executing elasticity strategy:', elasticityStrategy);
        const target = await this.loadTarget(elasticityStrategy);

        const containers = target.spec.template.spec.containers;
        if (containers?.length !== 1) {
            throw new ElasticityStrategyExecutionError(
                // eslint-disable-next-line max-len
                `VerticalElasticityStrategyControllerBase only supports targets with exactly 1 container per pod. The selected target has ${containers?.length} containers.`,
                elasticityStrategy,
            );
        }

        const container = containers[0];
        const newResources = await this.computeResources(elasticityStrategy, container);
        this.normalizeResources(newResources, elasticityStrategy.spec.staticConfig);

        if (!this.checkIfOutsideStabilizationWindow(elasticityStrategy, container.resources, newResources)) {
            console.log(
                'Skipping scaling, because stabilization window has not yet passed for: ',
                elasticityStrategy,
            );
            return;
        }

        container.resources = newResources;
        await this.orchClient.update(target);
        this.stabilizationWindowTracker.trackExecution(elasticityStrategy);
        console.log('Successfully scaled.', elasticityStrategy, newResources);
    }

    onElasticityStrategyDeleted?(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): void {
        this.stabilizationWindowTracker.removeElasticityStrategy(elasticityStrategy);
    }

    onDestroy?(): void {
        clearInterval(this.evictionInterval);
    }

    private loadTarget(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): Promise<PodTemplateContainer> {
        const targetRef = elasticityStrategy.spec.targetRef;
        const queryApiObj = new PodTemplateContainer({
            objectKind: new ObjectKind({
                group: targetRef.group,
                version: targetRef.version,
                kind: targetRef.kind,
            }),
            metadata: new ApiObjectMetadata({
                namespace: elasticityStrategy.metadata.namespace,
                name: targetRef.name,
            }),
        });

        return this.orchClient.read(queryApiObj);
    }

    private normalizeResources(resources: Resources, config: VerticalElasticityStrategyConfig): void {
        Object.keys(resources).forEach((key: keyof Resources) => {
            const min: number = config.minResources[key];
            const max: number = config.maxResources[key];

            let value: number = resources[key];
            value = Math.max(min, value);
            value = Math.min(max, value);
            resources[key] = value;
        });
    }

    /**
     * @returns `true` if the upcoming scaling action is outside of the stabilization window of the `elasticityStrategy`.
     */
     private checkIfOutsideStabilizationWindow(
        elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>,
        oldResources: Resources,
        newResources: Resources,
    ): boolean {
        let isScaleUp = false;
        Object.keys(newResources).forEach((key: keyof Resources) => {
            if (newResources[key] > oldResources[key]) {
                isScaleUp = true;
            }
        });

        if (isScaleUp) {
            return this.stabilizationWindowTracker.isOutsideStabilizationWindowForScaleUp(elasticityStrategy);
        } else {
            return this.stabilizationWindowTracker.isOutsideStabilizationWindowForScaleDown(elasticityStrategy);
        }
    }

}
