import { SloTarget } from '../../../model';
import { PolishedMetricParams, PolishedMetricSource, PolishedMetricSourceFactory, PolishedMetricType } from '../../../polished-metrics';
import { TimeSeriesSource } from '../../../raw-metrics-query/public';
import { MetricsSourcesManager } from '../../public/metrics-source';

type AnyPolishedMetricSourceFactory = PolishedMetricSourceFactory<PolishedMetricType<any, any, any>, any, any, any>;

/** Stores a map of factories for one `PolishedMetricSourceType`. */
interface PolishedMetricTypeFactories {

    factories: Map<string, PolishedMetricSourceFactory<any, any, any, any>>;

    defaultFactory?: PolishedMetricSourceFactory<any, any, any, any>;
}

export class DefaultMetricsSourcesManager implements MetricsSourcesManager {

    private timeSeriesSources: Map<string, TimeSeriesSource> = new Map();
    private defaultTimeSeriesSource: TimeSeriesSource;

    /**
     * Two-level map of factories for `PolishedMetricSources`.
     *
     * The first level groups the factories by their `metricType`.
     * The second level uses the `metricSourceName` of each factory and also stores a default factory for the type.
     */
    private polishedMetricSourceFactories: Map<string, PolishedMetricTypeFactories> = new Map();

    addTimeSeriesSource(source: TimeSeriesSource, setAsDefault: boolean = false): void {
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

    addPolishedMetricSourceFactory(factory: AnyPolishedMetricSourceFactory, setAsDefault?: boolean): void {
        const metricTypeStr = factory.metricType.metricTypeName;
        const sourceName = factory.metricSourceName;

        let typeFactories = this.polishedMetricSourceFactories.get(metricTypeStr);
        if (typeFactories) {
            typeFactories = { factories: new Map() };
            this.polishedMetricSourceFactories.set(metricTypeStr, typeFactories);
        }

        typeFactories.factories.set(sourceName, factory);
        if (setAsDefault) {
            typeFactories.defaultFactory = factory;
        }
    }

    getPolishedMetricSource<
        M extends PolishedMetricType<V, T, P>,
        V,
        T extends SloTarget,
        P extends PolishedMetricParams,
    >(metricType: M, sloTarget: T, params?: P): PolishedMetricSource<V> {
        const typeFactories = this.polishedMetricSourceFactories.get(metricType.metricTypeName);
        if (!typeFactories) {
            return undefined;
        }

        let factory: PolishedMetricSourceFactory<M, V, T, P>;
        if (params?.metricSourceName) {
            factory = typeFactories.factories.get(params.metricSourceName);
        } else {
            factory = typeFactories.defaultFactory;
        }

        if (!factory) {
            return undefined;
        }
        return factory.createSource(sloTarget, params);
    }

}
