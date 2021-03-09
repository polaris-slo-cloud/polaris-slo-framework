import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Sample } from '../../../raw-metrics-query/public';
import { PolishedMetricSource } from './polished-metric-source';

/**
 * `PolishedMetricSourceBase` may be used as a superclass for `PolishedMetricSource` implementations.
 *
 * It implements common operations in a resusable manner.
 */
export abstract class PolishedMetricSourceBase<V> implements PolishedMetricSource<V> {

    getCurrentValue(): Observable<Sample<V>> {
        return this.getValueStream().pipe(
            take(1),
        );
    }

    abstract getValueStream(): Observable<Sample<V>>;

}
