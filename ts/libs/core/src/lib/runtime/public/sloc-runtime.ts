import { ElasticityStrategyService } from '../../elasticity';
import { SloControlLoop, SloEvaluator } from '../../slo';
import { SlocTransformationService } from '../../transformation';
import { ObjectKindWatcher, WatchManager } from './watch';

let slocRuntimeSingleton: SlocRuntime;

/**
 * @returns The instance of the `SlocRuntime` singleton or `undefined` if it has not been initialized yet.
 */
export function getSlocRuntime(): SlocRuntime {
    return slocRuntimeSingleton;
}


/**
 * @returns The instance of the `SlocRuntime` singleton.
 * @throws An error if the `SlocRuntime` singleton has not yet been initialized.
 */
export function getSlocRuntimeOrThrow(): SlocRuntime {
    if (!slocRuntimeSingleton) {
        throw new Error(`The SlocRuntime singleton's value is ${slocRuntimeSingleton}. Did you forget to initialize it?`);
    }
    return slocRuntimeSingleton;
}

/**
 * Sets the `SlocRuntime` singleton.
 */
export function initSlocRuntime(runtime: SlocRuntime): void {
    slocRuntimeSingleton = runtime;
}

/**
 * Interface that must be implemented by a class that exposes a SLOC runtime.
 *
 * User `getSlocRuntime()` to obtain an instance of the `SlocRuntime` singleton.
 *
 * Use `initSlocRuntime()` to set the instance of the `SlocRuntime` singleton.
 */
export interface SlocRuntime {

    /**
     * The `SlocTransformationService` that should be used for converting between orchestrator-independent SLOC objects
     * and orchestrator-specific plain objects, which can be serialized.
     */
    transformer: SlocTransformationService;

    /**
     * The `ElasticityStrategyService` that should be used for creating and configuring elasticity strategies.
     */
    elasticityStrategyService: ElasticityStrategyService;

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
