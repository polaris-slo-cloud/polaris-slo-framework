
/**
 * Base interface for an optional parameter object that can be used for configuring a
 * `PolishedMetricSource` when obtaining it.
 */
export interface PolishedMetricParams {

    /**
     * (optional) The full name of the `PolishedMetricSource` that should be obtained.
     *
     * The `PolishedMetricType` only describes the type of metric, which may be supplied
     * by multiple sources.
     */
    metricSourceName?: string;

}
