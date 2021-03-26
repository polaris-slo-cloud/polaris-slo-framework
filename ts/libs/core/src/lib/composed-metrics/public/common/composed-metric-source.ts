import { Observable } from 'rxjs';
import { Sample } from '../../../raw-metrics-query/public';

/**
 * A `ComposedMetricSource` is used to obtain a complex, processed metric from an `SloTarget`.
 *
 * @param V The TypeScript type that represents the values of the composed metric.
 */
export interface ComposedMetricSource<V> {

    /**
     * @returns An observable that emits the current value of the composed metric and then completes.
     */
    getCurrentValue(): Observable<Sample<V>>;

    /**
     * @returns An observable that emits the composed metric's values as they become available, starting with
     * the current value.
     */
    getValueStream(): Observable<Sample<V>>;

}
