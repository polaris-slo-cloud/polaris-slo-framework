import { interval } from 'rxjs';
import { finalize, take, takeUntil, timeout } from 'rxjs/operators';
import { ComposedMetricMapping, ComposedMetricParams, ObjectKind } from '../../../../model';
import { ObjectKindWatchHandlerPair, WatchManager } from '../../../../orchestrator';
import { PolarisRuntime } from '../../../../runtime';
import { Logger, ObservableStopper, executeSafely } from '../../../../util';
import { ComposedMetricError, ComposedMetricMappingError, ComposedMetricSource } from '../../common';
import { ComposedMetricCollector } from '../composed-metric-collector';
import {
    COMPOSED_METRIC_COMPUTATION_DEFAULT_INTERVAL_MS,
    ComposedMetricComputationConfig,
    ComposedMetricsManager,
    ComposedMetricsManagerConfig,
} from '../composed-metrics-manager';
import { DefaultComposedMetricMappingWatchEventsHandler, ModifiableComposedMetricsManager } from './default-composed-metric-mapping-watch-handler';

interface ActiveComposedMetric {

    mapping: ComposedMetricMapping;

    metricParams: ComposedMetricParams;

    metricSource: ComposedMetricSource<any>;

    collectors: ComposedMetricCollector<any>[];

    /** Used to stop a computation that is in progress. */
    stopper: ObservableStopper;

}

/**
 * The default implementation of {@link ComposedMetricsManager} that is usable with all orchestrators
 * and `ComposedMetricCollectors`.
 */
export class DefaultComposedMetricsManager implements ComposedMetricsManager, ModifiableComposedMetricsManager {

    private config: ComposedMetricsManagerConfig;

    private stopper: ObservableStopper;

    private intervalMs: number;

    /** Used to watch the `ComposedMetricMapping` kinds. */
    private watchManager: WatchManager;

    /** Indexes the active metrics by their `ComposedMetricMapping` keys. */
    private activeComposedMetrics: Map<string, ActiveComposedMetric>;

    constructor(private polarisRuntime: PolarisRuntime) { }

    get isActive(): boolean {
        return !!this.config;
    }

    async startWatching(config: ComposedMetricsManagerConfig): Promise<void> {
        this.intervalMs = config.evaluationIntervalMs ?? COMPOSED_METRIC_COMPUTATION_DEFAULT_INTERVAL_MS;
        this.activeComposedMetrics = new Map();
        this.stopper = new ObservableStopper();
        this.watchManager = this.polarisRuntime.createWatchManager();

        const kindWatcherPairs: ObjectKindWatchHandlerPair[] = config.kindsToWatch.map(computationConfig => ({
            kind: computationConfig.mappingKind,
            handler: new DefaultComposedMetricMappingWatchEventsHandler(this, computationConfig),
        }));

        await this.watchManager.startWatchers(kindWatcherPairs)
        this.config = config;

        interval(this.intervalMs).pipe(
            takeUntil(this.stopper.stopper$),
            finalize(() => this.disposeAllActiveMetrics()),
        ).subscribe({
            next: () => this.executeLoopIteration(),
            error: (err) => {
                Logger.error(err);
                this.stopWatching();
            },
        });
    }

    stopWatching(): void {
        if (!this.isActive) {
            throw new ComposedMetricError('The ComposedMetricsManager cannot be stopped, because it is currently not active.')
        }

        const watchedKinds = this.config.kindsToWatch.map(config => config.mappingKind);
        this.watchManager.stopWatchers(watchedKinds);

        this.stopper.stop();
        this.watchManager = null;
        this.stopper = null;
        this.activeComposedMetrics = null;
        this.config = null;
    }

    getWatchedComposedMetricMappingKinds(): ComposedMetricComputationConfig<any, any, ComposedMetricParams>[] {
        return this.config?.kindsToWatch;
    }

    /**
     * Adds the specified {@link ComposedMetricMapping} to this manager to periodically compute the metric.
     *
     * @param mapping The {@link ComposedMetricMapping} to be added.
     * @param computationConfig The {@link ComposedMetricComputationConfig} for the mapping's composed metric type.
     */
    addComposedMetricMapping(mapping: ComposedMetricMapping, computationConfig: ComposedMetricComputationConfig): void {
        const key = this.getComposedMetricMappingKey(mapping);
        if (this.activeComposedMetrics.has(key)) {
            throw new ComposedMetricMappingError(
                'Cannot add Composed Metric, because an instance of it already exists.',
                mapping,
                computationConfig.metricType,
            );
        }

        if (!mapping.spec.metricConfig) {
            mapping.spec.metricConfig = {};
        }
        const metricParams: ComposedMetricParams = {
            sloTarget: mapping.spec.targetRef,
            namespace: mapping.metadata.namespace,
            owner: mapping.getOwnerRef(),
            ...mapping.spec.metricConfig,
        };

        const activeMetric: ActiveComposedMetric = {
            mapping,
            metricParams,
            metricSource: computationConfig.metricSourceFactory.createSource(metricParams, this.polarisRuntime.metricsSourcesManager, this.polarisRuntime),
            collectors: this.config.collectorFactories.map(factory => factory.createCollector(computationConfig.metricType, metricParams)),
            stopper: new ObservableStopper(),
        };
        Logger.log('Added composed metric mapping', mapping, metricParams);
        this.activeComposedMetrics.set(key, activeMetric);
    }

    /**
     * Removes the {@link ComposedMetricMapping} with the specified `key`.
     *
     * @param key The {@link ComposedMetricMapping} to be deleted (identified through its metadata).
     */
    removeComposedMetricMapping(mapping: ComposedMetricMapping): void {
        const key = this.getComposedMetricMappingKey(mapping);
        const activeMetric = this.activeComposedMetrics.get(key);
        if (activeMetric) {
            this.activeComposedMetrics.delete(key);
            this.disposeActiveMetric(activeMetric);
        }
    }

    private getComposedMetricMappingKey(mapping: ComposedMetricMapping): string {
        return `${ObjectKind.stringify(mapping.objectKind)}/${mapping.metadata.namespace}/${mapping.metadata.name}`;
    }

    private executeLoopIteration(): void {
        this.activeComposedMetrics.forEach(activeMetric => {
            const metricValue$ = activeMetric.metricSource.getValueStream().pipe(
                timeout(this.intervalMs),

                // Allow stopping the computation if the activeMetric should be removed.
                takeUntil(activeMetric.stopper.stopper$),
                // Allow stopping the computation if the control loop is stopped.
                takeUntil(this.stopper.stopper$),

                take(1),
            );
            metricValue$.subscribe({
                next: value => {
                    activeMetric.collectors.forEach(
                        collector => executeSafely(() => collector.collect(value)),
                    );
                },
                error: err => Logger.error(err),
            });
        });
    }

    private disposeActiveMetric(activeMetric: ActiveComposedMetric): void {
        activeMetric.stopper.stop();
        activeMetric.collectors.forEach(
            collector => executeSafely(() => collector.dispose()),
        );
    }

    private disposeAllActiveMetrics(): void {
        this.activeComposedMetrics.forEach(activeMetric => this.disposeActiveMetric(activeMetric));
        this.activeComposedMetrics.clear();
    }

}
