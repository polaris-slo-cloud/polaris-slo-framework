import { Observable, interval } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { Sample } from '../../../raw-metrics-query/public';
import { SlocRuntime } from '../../../runtime';
import { PolishedMetricSource } from './polished-metric-source';

const POLLING_INTERVAL_MSEC = 10000;

/**
 * `PolishedMetricSourceBase` may be used as a superclass for `PolishedMetricSource` implementations.
 *
 * It implements common operations in a resusable manner.
 */
export abstract class PolishedMetricSourceBase<V> implements PolishedMetricSource<V> {

    constructor(protected slocRuntime: SlocRuntime) {}

    getCurrentValue(): Observable<Sample<V>> {
        return this.getValueStream().pipe(
            take(1),
        );
    }

    abstract getValueStream(): Observable<Sample<V>>;

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
