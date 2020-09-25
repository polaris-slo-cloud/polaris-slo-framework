import { SlocTransformationService } from '../../transformation';

let slocRuntimeSingleton: SlocRuntime;

/**
 * @returns The instance of the `SlocRuntime` singleton.
 */
export function getSlocRuntime(): SlocRuntime {
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

}
