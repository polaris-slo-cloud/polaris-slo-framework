import {
    ApiObjectMetadata,
    Container,
    ContainerResources,
    ElasticityStrategy,
    ObjectKind,
    PodTemplateContainer,
    Resources,
    SloCompliance,
    SloTarget,
    VerticalElasticityStrategyConfig,
} from '../../../../../model';
import { OrchestratorClient, PolarisRuntime } from '../../../../../runtime';
import { Logger } from '../../../../../util';
import { ElasticityStrategyExecutionError, StabilizationWindowTracker } from '../../../common';
import { DefaultStabilizationWindowTracker } from '../default-stabilization-window-tracker';
import { SloComplianceElasticityStrategyControllerBase } from './slo-compliance-elasticity-strategy-controller.base';

/** Tracked executions eviction interval of 20 minutes. */
const EVICTION_INTERVAL_MSEC = 20 * 60 * 1000;

const SCALE_UP_PERCENT_DEFAULT = 10;
const SCALE_DOWN_PERCENT_DEFAULT = 10;

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
     * The resource numbers calculated by this method will be normalized by `VerticalElasticityStrategyControllerBase`
     * to fit into the limits defined by the `elasticityStrategy` instance.
     *
     * @param elasticityStrategy The current elasticity strategy instance.
     * @param container The container, for which to compute the resources.
     * @returns A promise that resolves to the new resources that should be configured for the container.
     */
    abstract computeResources(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>, container: Container): Promise<ContainerResources>;

    async execute(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): Promise<void> {
        Logger.log('Executing elasticity strategy:', elasticityStrategy);
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
        let newResources = await this.computeResources(elasticityStrategy, container);
        newResources = this.normalizeResources(newResources, elasticityStrategy.spec.staticConfig);

        if (!this.checkIfOutsideStabilizationWindow(elasticityStrategy, container.resources, newResources)) {
            Logger.log(
                'Skipping scaling, because stabilization window has not yet passed for: ',
                elasticityStrategy,
            );
            return;
        }

        container.resources = newResources;
        await this.orchClient.update(target);
        this.stabilizationWindowTracker.trackExecution(elasticityStrategy);
        Logger.log('Successfully scaled.', elasticityStrategy, newResources);
    }

    onElasticityStrategyDeleted?(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): void {
        this.stabilizationWindowTracker.removeElasticityStrategy(elasticityStrategy);
    }

    onDestroy?(): void {
        clearInterval(this.evictionInterval);
    }

    /**
     * @returns `config.scaleUpPercent` or, if it is not set, its default value.
     */
    protected getScaleUpPercentOrDefault(config: VerticalElasticityStrategyConfig): number {
        return config.scaleUpPercent ?? SCALE_UP_PERCENT_DEFAULT;
    }

    /**
     * @returns `config.scaleDownPercent` or, if it is not set, its default value.
     */
     protected getScaleDownPercentOrDefault(config: VerticalElasticityStrategyConfig): number {
        return config.scaleDownPercent ?? SCALE_DOWN_PERCENT_DEFAULT;
    }

    private async loadTarget(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): Promise<PodTemplateContainer> {
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

        const ret = await this.orchClient.read(queryApiObj);
        if (!ret.spec?.template) {
            throw new ElasticityStrategyExecutionError('The SloTarget does not contain a pod template (spec.template field).', elasticityStrategy);
        }
        return ret;
    }

    private normalizeResources(resources: ContainerResources, config: VerticalElasticityStrategyConfig): ContainerResources {
        return resources.scale((key, value) => {
            const min: number = config.minResources[key];
            const max: number = config.maxResources[key];

            value = Math.max(min, value);
            value = Math.min(max, value);
            return value;
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
