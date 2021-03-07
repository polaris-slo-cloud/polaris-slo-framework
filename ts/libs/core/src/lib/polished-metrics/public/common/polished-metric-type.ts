import { SloTarget } from '../../../model';
import { TypeFn } from '../../../util';

/**
 * Describes a type of polished metric.
 *
 * Each `PolishedMetricType` may be supplied by multiple `PolishedMetricSources`.
 *
 * @param V The TypeScript type that represents the values of the polished metric.
 * @param T The type of `SloTarget` that the polished metric can be obtained from.
 * @param P Optional parameters that can be used to configure the `PolishedMetricSource`.
 */
export abstract class PolishedMetricType<V, T extends SloTarget = SloTarget, P = never> {

    /**
     * This property is needed to trigger type checking for the `V` parameter.
     */
    private _metricValueType: TypeFn<V>;

    /**
     * This property is needed to trigger type checking for the `T` parameter.
     */
    private _sloTargetType: TypeFn<T>;

    /**
     * This property is needed to trigger type checking for the `P` parameter.
     */
    private _paramsType: TypeFn<P>;

    /**
     * The fully qualified name of the this metric type.
     */
    readonly metricTypeName: string;

}
