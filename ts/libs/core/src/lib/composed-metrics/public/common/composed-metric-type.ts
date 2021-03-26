import { TypeFn } from '../../../util';
import { ComposedMetricParams } from './composed-metric-params';

/**
 * Describes a type of composed metric.
 *
 * Each `ComposedMetricType` may be supplied by multiple `ComposedMetricSources`.
 *
 * @param V The TypeScript type that represents the values of the composed metric.
 * @param P Optional parameters that can be used to configure the `ComposedMetricSource`.
 */
export abstract class ComposedMetricType<V, P extends ComposedMetricParams = ComposedMetricParams> {

    /**
     * This property is needed to trigger type checking for the `V` parameter.
     */
    private _metricValueType: TypeFn<V>;

    /**
     * This property is needed to trigger type checking for the `P` parameter.
     */
    private _paramsType: TypeFn<P>;

    /**
     * The fully qualified name of the this metric type.
     */
    abstract readonly metricTypeName: string;

}
