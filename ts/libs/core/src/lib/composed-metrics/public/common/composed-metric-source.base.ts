import { Observable, interval } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { Sample } from '../../../raw-metrics-query/public';
import { PolarisRuntime } from '../../../runtime';
import { ComposedMetricSource } from './composed-metric-source';

const POLLING_INTERVAL_MSEC = 10000;

/**
 * `ComposedMetricSourceBase` may be used as a superclass for {@link ComposedMetricSource} implementations.
 *
 * It implements common operations in a reusable manner.
 */
export abstract class ComposedMetricSourceBase<V> implements ComposedMetricSource<V> {

    constructor(protected polarisRuntime: PolarisRuntime) {}

    abstract getValueStream(): Observable<Sample<V>>;

    getCurrentValue(): Observable<Sample<V>> {
        return this.getValueStream().pipe(
            take(1),
        );
    }

    /**
     * Helper method to create an observable that emits immediately and then at the default polling interval.
     *
     * The emitted value counts the number of emissions, starting with `0`, like `interval()`.
     *
     * This should be used for realizing `getValueStream()` on raw metrics sources that require polling.
     */
    protected getDefaultPollingInterval(): Observable<number> {
        return interval(POLLING_INTERVAL_MSEC).pipe(
            startWith(-1),
            map(counter => counter + 1),
        );
    }

}
