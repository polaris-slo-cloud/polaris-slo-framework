import { TypeFn } from '../../../util';
import { PolishedMetricParams } from './polished-metric-params';

/**
 * Describes a type of polished metric.
 *
 * Each `PolishedMetricType` may be supplied by multiple `PolishedMetricSources`.
 *
 * @param V The TypeScript type that represents the values of the polished metric.
 * @param P Optional parameters that can be used to configure the `PolishedMetricSource`.
 */
export abstract class PolishedMetricType<V, P extends PolishedMetricParams = PolishedMetricParams> {

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
