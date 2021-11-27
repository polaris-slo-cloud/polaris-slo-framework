import { ComposedMetricParams } from '../../../model';
import { Sample } from '../../../raw-metrics-query';
import { ComposedMetricType } from '../common';

/**
 * Used to collect samples of a composed metric, which are then sent to a DB or cached for
 * being fetched, e.g., via REST.
 *
 * @param V The TypeScript type that represents the values of the composed metric.
 */
export interface ComposedMetricCollector<V> {

    /**
     * Adds the specified `sample` to this collector.
     */
    collect(sample: Sample<V>): void;

    /**
     * Destroys and unregisters this collector.
     */
    dispose(): void;

}

/**
 * Creates a {@link ComposedMetricCollector} instance for each composed metric and `SloTarget` combination.
 */
export interface ComposedMetricCollectorFactory {

    /**
     * Creates a {@link ComposedMetricCollector} for the specified {@link ComposedMetricType} and target `params` combination.
     *
     * @param metricType The {@link ComposedMetricType} that should be collected.
     * @param params The {@link ComposedMetricParams} that specify for which `SloTarget` the metric should be collected.
     * @returns A new {@link ComposedMetricCollector} instance.
     */
    createCollector<M extends ComposedMetricType<V, ComposedMetricParams>, V>(metricType: M, params: ComposedMetricParams): ComposedMetricCollector<V>;

}

