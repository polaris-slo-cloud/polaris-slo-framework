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
     * The fully qualified name of the this metric type in the `group/version/kind` format.
     *
     * @example 'metrics.polaris-slo-cloud.github.io/v1/cost-efficiency'
     */
    abstract readonly metricTypeName: string;

    /**
     * This property is needed to trigger type checking for the `V` parameter.
     * DO NOT use this property in your code.
     *
     * It cannot be a private property, because then TypeScript would omit the type
     * in the .d.ts file that is shipped in the npm package.
     *
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    protected __metricValueType: TypeFn<V>;

    /**
     * This property is needed to trigger type checking for the `P` parameter.
     * DO NOT use this property in your code.
     *
     * It cannot be a private property, because then TypeScript would omit the type
     * in the .d.ts file that is shipped in the npm package.
     *
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    protected __paramsType: TypeFn<P>;

}
