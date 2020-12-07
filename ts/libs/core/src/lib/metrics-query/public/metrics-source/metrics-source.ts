import { TimeSeriesSource } from '../time-series';

/**
 * Encapsulates a source for obtaining metrics.
 */
export interface MetricsSource {

    /**
     * Gets the `TimeSeriesSource` with the specified `name`.
     *
     * @param name The fully qualified name of the `TimeSeriesSource`.
     * @returns The `TimeSeriesSource` with the specified `name` or `undefined` if the `name` is unknown.
     */
    getTimeSeriesSource(name: string): TimeSeriesSource;

}
