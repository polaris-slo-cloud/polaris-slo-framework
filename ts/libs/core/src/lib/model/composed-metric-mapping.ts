import { PolarisType } from '../transformation';
import { ApiObject } from './api-object';
import { SloTarget } from './slo-target';

/**
 * Defines the configuration data for a composed metric mapping that is used for configuring
 * a composed metric controller.
 */
export class ComposedMetricMappingSpec<T extends SloTarget = SloTarget> {

    /**
     * Specifies the target that should be monitored.
     */
    @PolarisType(() => SloTarget)
    targetRef: T;

    /**
     * The interval, at which the composed metric should be computed (in seconds).
     */
    intervalSec: number;

}

/**
 * Used to submit/retrieve an composed metric mapping to/from the orchestrator.
 *
 * @param T The type of {@link ComposedMetricMappingSpec} - decorate `spec` with `@PolarisType` if you set this parameter explicitly.
 */
export class ComposedMetricMapping<T extends ComposedMetricMappingSpec<any> = ComposedMetricMappingSpec> extends ApiObject<T> {

    @PolarisType(() => ComposedMetricMappingSpec)
    spec: T;

    constructor(initData?: Partial<ComposedMetricMapping<T>>) {
        super(initData);
    }

}
