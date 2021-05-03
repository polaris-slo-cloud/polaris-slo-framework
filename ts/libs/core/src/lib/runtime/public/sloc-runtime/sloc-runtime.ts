import { ElasticityStrategyService } from '../../../elasticity';
import { SloControlLoop, SloEvaluator } from '../../../slo';
import { PolarisTransformationService } from '../../../transformation';
import { MetricsSourcesManager } from '../metrics-source';
import { ObjectKindWatcher, WatchManager } from '../watch';

let slocRuntimeSingleton: PolarisRuntime;

/**
 * @returns The instance of the `PolarisRuntime` singleton or `undefined` if it has not been initialized yet.
 */
export function getPolarisRuntime(): PolarisRuntime {
    return slocRuntimeSingleton;
}


/**
 * @returns The instance of the `PolarisRuntime` singleton.
 * @throws An error if the `PolarisRuntime` singleton has not yet been initialized.
 */
export function getPolarisRuntimeOrThrow(): PolarisRuntime {
    if (!slocRuntimeSingleton) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`The PolarisRuntime singleton's value is ${slocRuntimeSingleton}. Did you forget to initialize it?`);
    }
    return slocRuntimeSingleton;
}

/**
 * Sets the `PolarisRuntime` singleton.
 */
export function initPolarisRuntime(runtime: PolarisRuntime): void {
    slocRuntimeSingleton = runtime;
}

/**
 * Interface that must be implemented by a class that exposes a SLOC runtime.
 *
 * User `getPolarisRuntime()` to obtain an instance of the `PolarisRuntime` singleton.
 *
 * Use `initPolarisRuntime()` to set the instance of the `PolarisRuntime` singleton.
 */
export interface PolarisRuntime {

    /**
     * The `PolarisTransformationService` that should be used for converting between orchestrator-independent SLOC objects
     * and orchestrator-specific plain objects, which can be serialized.
     */
    transformer: PolarisTransformationService;

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
     * Creates an `ObjectKindWatcher` specific to this runtime implementation.
     */
    createObjectKindWatcher(): ObjectKindWatcher;

    /**
     * Creates a new `WatchManager` for watching multiple `ObjectKinds`.
     */
    createWatchManager(): WatchManager;

}
