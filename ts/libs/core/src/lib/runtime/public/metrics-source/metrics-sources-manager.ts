import { ComposedMetricSourceFactory, ComposedMetricType } from '../../../composed-metrics';
import { ObjectKind } from '../../../model';
import { TimeSeriesSource } from '../../../raw-metrics-query/public/time-series';
import { MetricsSource } from './metrics-source';

/**
 * Allows managing the available sources for obtaining metrics.
 */
export interface MetricsSourcesManager extends MetricsSource {

    /**
     * Adds the specified {@link TimeSeriesSource} to this manager.
     *
     * @param source The `TimeSeriesSource` that should be added.
     * @param setAsDefault (optional) If `true`, sets `source` as the default `TimeSeriesSource`. Default = `false`.
     * If this is the first source that is added, it is always set as default.
     */
    addTimeSeriesSource(source: TimeSeriesSource, setAsDefault?: boolean): void;

    /**
     * Sets the {@link TimeSeriesSource} with the specified name as the default source.
     *
     * @param name The full name of the `TimeSeriesSource`.
     * @returns The new default `TimeSeriesSource` or `undefined` if no `TimeSeriesSource` with the specified `name` exists.
     */
    setDefaultTimeSeriesSource(name: string): TimeSeriesSource;

    /**
     * Adds the specified {@link ComposedMetricSourceFactory} to this manager for
     * a particular type of `SloTarget`.
     *
     * Adding the same factory for multiple `SloTarget` types is possible.
     *
     * If a factory is registered without the `sloTargetType` parameter, it is used within the `ComposedMetricType`
     * for all `SloTarget` types, for which no factory has been registered.
     *
     * @param factory The `ComposedMetricSourceFactory` that should be added.
     * @param sloTargetType The type of `SloTarget` that this factory should be registered for.
     */
    addComposedMetricSourceFactory(factory: ComposedMetricSourceFactory<ComposedMetricType<any, any>>, sloTargetType?: ObjectKind): void;

    /**
     * Adds the specified {@link ComposedMetricSourceFactory} to this manager as the fallback factory to use
     * in the following cases:
     * - if no factory is registered for a particular `ComposedMetricType` or
     * - if none of the factories registered for a `ComposedMetricType` match the requested `SloTarget` type
     *   and there is no fallback factory within that `ComposedMetricType.
     *
     * @param factory The `ComposedMetricSourceFactory` that should be added.
     */
    setFallbackComposedMetricSourceFactory(factory: ComposedMetricSourceFactory<ComposedMetricType<any, any>>): void;

}
