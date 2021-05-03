import { ComposedMetricParams, ComposedMetricSource, ComposedMetricSourceFactory, ComposedMetricType } from '../../../composed-metrics';
import { TimeSeriesSource } from '../../../raw-metrics-query/public';
import { PolarisRuntime } from '../../public';
import { MetricsSourcesManager } from '../../public/metrics-source';

/** Stores a map of factories for one `ComposedMetricSourceType`. */
interface ComposedMetricTypeFactories {

    factories: Map<string, ComposedMetricSourceFactory<ComposedMetricType<any, any>>>;

    defaultFactory?: ComposedMetricSourceFactory<ComposedMetricType<any, any>>;
}

export class DefaultMetricsSourcesManager implements MetricsSourcesManager {

    private timeSeriesSources: Map<string, TimeSeriesSource> = new Map();
    private defaultTimeSeriesSource: TimeSeriesSource;

    /**
     * Two-level map of factories for `ComposedMetricSources`.
     *
     * The first level groups the factories by their `metricType`.
     * The second level uses the `metricSourceName` of each factory and also stores a default factory for the type.
     */
    private composedMetricSourceFactories: Map<string, ComposedMetricTypeFactories> = new Map();

    constructor(private slocRuntime: PolarisRuntime) {}

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

    addComposedMetricSourceFactory(factory: ComposedMetricSourceFactory<ComposedMetricType<any, any>>, setAsDefault: boolean = false): void {
        const metricTypeStr = factory.metricType.metricTypeName;
        const sourceName = factory.metricSourceName;

        let typeFactories = this.composedMetricSourceFactories.get(metricTypeStr);
        if (!typeFactories) {
            typeFactories = { factories: new Map() };
            this.composedMetricSourceFactories.set(metricTypeStr, typeFactories);
            setAsDefault = true;
        }

        typeFactories.factories.set(sourceName, factory);
        if (setAsDefault) {
            typeFactories.defaultFactory = factory;
        }
    }

    getComposedMetricSource<V, P extends ComposedMetricParams>(
        metricType: ComposedMetricType<V, P>,
        params: P,
        metricSourceName?: string,
    ): ComposedMetricSource<V> {
        const typeFactories = this.composedMetricSourceFactories.get(metricType.metricTypeName);
        if (!typeFactories) {
            return undefined;
        }

        const factory = metricSourceName ? typeFactories.factories.get(metricSourceName) : typeFactories.defaultFactory;
        if (!factory) {
            return undefined;
        }

        return factory.createSource(params, this.slocRuntime);
    }

}
