import { TypeFn } from '../../../util';

export class PolishedMetricType<V> {

    /**
     * This property is needed to trigger type checking for the `V` parameter.
     */
    private _metricValueType: TypeFn<V>;

    /**
     * The fully qualified name of the this metric type.
     */
    readonly metricTypeName: string;

}
