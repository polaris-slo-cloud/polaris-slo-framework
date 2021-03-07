import { TimeSeriesSource } from '../../../raw-metrics-query/public/time-series';
import { MetricsSource } from './metrics-source';

/**
 * Allows managing the available sources for obtaining metrics.
 */
export interface MetricsSourcesManager extends MetricsSource {

    /**
     * Adds the specified `TimeSeriesSource` to this manager.
     *
     * @param source The `TimeSeriesSource` that should be added.
     * @param setAsDefault (optional) If `true`, sets `source` as the default `TimeSeriesSource`. Default = `false`.
     */
    addTimeSeriesSource(source: TimeSeriesSource, setAsDefault?: boolean): void;

    /**
     * Sets the `TimeSeriesSource` with the specified name as the default source.
     *
     * @param name The full name of the `TimeSeriesSource`.
     * @returns The new default `TimeSeriesSource` or `undefined` if no `TimeSeriesSource` with the specified `name` exists.
     */
    setDefaultTimeSeriesSource(name: string): TimeSeriesSource;

}
