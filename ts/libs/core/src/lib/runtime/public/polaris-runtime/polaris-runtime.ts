import { ComposedMetricsManager } from '../../../composed-metrics/public/control/composed-metrics-manager';
import { ElasticityStrategyManager } from '../../../elasticity/public/control/elasticity-strategy-manager';
import { ElasticityStrategyService } from '../../../elasticity/public/service/elasticity-strategy-service';
import { OrchestratorGateway } from '../../../orchestrator';
import { SloControlLoop } from '../../../slo/public/control/slo-control-loop';
import { SloEvaluator } from '../../../slo/public/control/slo-evaluator';
import { PolarisTransformationServiceManager } from '../../../transformation/public/common/polaris-transformation-service-manager';
import { MetricsSourcesManager } from '../metrics-source';

let polarisRuntimeSingleton: PolarisRuntime;

/**
 * @returns The instance of the `PolarisRuntime` singleton or `undefined` if it has not been initialized yet.
 */
export function getPolarisRuntime(): PolarisRuntime {
    return polarisRuntimeSingleton;
}


/**
 * @returns The instance of the `PolarisRuntime` singleton.
 * @throws An error if the `PolarisRuntime` singleton has not yet been initialized.
 */
export function getPolarisRuntimeOrThrow(): PolarisRuntime {
    if (!polarisRuntimeSingleton) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`The PolarisRuntime singleton's value is ${polarisRuntimeSingleton}. Did you forget to initialize it?`);
    }
    return polarisRuntimeSingleton;
}

/**
 * Sets the `PolarisRuntime` singleton.
 */
export function initPolarisRuntime(runtime: PolarisRuntime): void {
    polarisRuntimeSingleton = runtime;
}

/**
 * Interface that must be implemented by a class that exposes a Polaris runtime.
 *
 * User `getPolarisRuntime()` to obtain an instance of the `PolarisRuntime` singleton.
 *
 * Use `initPolarisRuntime()` to set the instance of the `PolarisRuntime` singleton.
 */
export interface PolarisRuntime extends OrchestratorGateway {

    /**
     * The `PolarisTransformationService` that should be used for converting between orchestrator-independent Polaris objects
     * and orchestrator-specific plain objects, which can be serialized.
     */
    transformer: PolarisTransformationServiceManager;

    /**
     * The `ElasticityStrategyService` that should be used for creating and configuring elasticity strategies.
     */
    elasticityStrategyService: ElasticityStrategyService;

    /**
     * The `MetricsSourcesManager` that can be used to register new metrics sources and for obtaining existing ones.
     */
    metricsSourcesManager: MetricsSourcesManager;

    /**
     * Creates an instance of the `SloEvaluator` specific to this runtime implementation.
     */
    createSloEvaluator(): SloEvaluator;

    /**
     * Creates an instance of the `SloControlLoop` specific to this runtime implementation.
     */
    createSloControlLoop(): SloControlLoop;

    /**
     * Creates an `ElasticityStrategyManager` instance.
     */
    createElasticityStrategyManager(): ElasticityStrategyManager;

    /**
     * Creates a new `ComposedMetricsManager` for computing composed metrics in a dedicated controller.
     */
    createComposedMetricsManager(): ComposedMetricsManager;

}
