import { TimeSeriesSource } from '../time-series';

/**
 * Encapsulates a source for obtaining metrics.
 */
export interface MetricsSource {

    /**
     * Gets the `TimeSeriesSource` with the specified `name` or the
     * default one, if no `name` is specified.
     *
     * @param name The fully qualified name of the `TimeSeriesSource`. If not specified, the default `TimeSeriesSource` is returned.
     * @returns The `TimeSeriesSource` with the specified `name` or `undefined` if the `name` is unknown.
     */
    getTimeSeriesSource(name?: string): TimeSeriesSource;

}
