import { ComposedMetricParams, ComposedMetricSource, ComposedMetricSourceFactory, ComposedMetricType } from '../../../composed-metrics';
import { ObjectKind } from '../../../model';
import { TimeSeriesSource } from '../../../raw-metrics-query/public';
import { PolarisRuntime } from '../../public';
import { MetricsSourcesManager } from '../../public/metrics-source';

/** Stores a map of factories for one `ComposedMetricSourceType`. */
interface ComposedMetricTypeFactories {

    /**
     * Map indexed by `ObjectKind` strings.
     */
    factories: Map<string, ComposedMetricSourceFactory<ComposedMetricType<any, any>>>;

    /**
     * This factory is registered without an `SloTarget` type and is used for all `SloTarget` types,
     * for which no specific factory has been registered.
     */
    fallbackFactory?: ComposedMetricSourceFactory<ComposedMetricType<any, any>>;
}

/**
 * Default implementation for {@link MetricsSourcesManager}.
 */
export class DefaultMetricsSourcesManager implements MetricsSourcesManager {

    private timeSeriesSources: Map<string, TimeSeriesSource> = new Map();
    private defaultTimeSeriesSource: TimeSeriesSource;

    /**
     * Two-level map of factories for `ComposedMetricSources`.
     *
     * - The first level groups the factories by their `ComposedMetricType`.
     * - The second level associates an `SloTarget` type with one factory.
     */
    private composedMetricSourceFactories: Map<string, ComposedMetricTypeFactories> = new Map();

    private fallbackComposedMetricSourceFactory: ComposedMetricSourceFactory<ComposedMetricType<any, any>>;

    constructor(private polarisRuntime: PolarisRuntime) {}

    addTimeSeriesSource(source: TimeSeriesSource, setAsDefault: boolean = false): void {
        if (this.timeSeriesSources.size === 0) {
            setAsDefault = true;
        }

        this.timeSeriesSources.set(source.name, source);
        if (setAsDefault) {
            this.setDefaultTimeSeriesSource(source.name);
        }
    }

    setDefaultTimeSeriesSource(name: string): TimeSeriesSource {
        this.defaultTimeSeriesSource = this.timeSeriesSources.get(name);
        return this.defaultTimeSeriesSource;
    }

    getTimeSeriesSource(name?: string): TimeSeriesSource {
        if (name) {
            return this.timeSeriesSources.get(name);
        } else {
            return this.defaultTimeSeriesSource;
        }
    }

    addComposedMetricSourceFactory(factory: ComposedMetricSourceFactory<ComposedMetricType<any, any>>, sloTargetType?: ObjectKind): void {
        const metricTypeStr = factory.metricType.metricTypeName;

        let typeFactories = this.composedMetricSourceFactories.get(metricTypeStr);
        if (!typeFactories) {
            typeFactories = { factories: new Map() };
            this.composedMetricSourceFactories.set(metricTypeStr, typeFactories);
        }

        if (sloTargetType) {
            const targetTypeStr = ObjectKind.stringify(sloTargetType);
            typeFactories.factories.set(targetTypeStr, factory);
        } else {
            typeFactories.fallbackFactory = factory;
        }
    }

    setFallbackComposedMetricSourceFactory(factory: ComposedMetricSourceFactory<ComposedMetricType<any, any>>): void {
        this.fallbackComposedMetricSourceFactory = factory;
    }

    getComposedMetricSource<V, P extends ComposedMetricParams>(
        metricType: ComposedMetricType<V, P>,
        params: P,
    ): ComposedMetricSource<V> {
        let factory: ComposedMetricSourceFactory<ComposedMetricType<any, any>>;

        const typeFactories = this.composedMetricSourceFactories.get(metricType.metricTypeName);
        if (typeFactories) {
            const targetTypeStr = ObjectKind.stringify(params.sloTarget);
            factory = typeFactories.factories.get(targetTypeStr) ?? typeFactories.fallbackFactory;
        }

        if (!factory) {
            factory = this.fallbackComposedMetricSourceFactory;
            if (!factory) {
                return undefined;
            }
        }

        return factory.createSource(params, this.polarisRuntime);
    }

}
