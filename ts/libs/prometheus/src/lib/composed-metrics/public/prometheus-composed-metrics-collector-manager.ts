import { Server } from 'http';
import {
    ComposedMetricCollector,
    ComposedMetricCollectorFactory,
    ComposedMetricError,
    ComposedMetricParams,
    ComposedMetricType,
    Logger,
    ObjectKind,
    Sample,
} from '@polaris-sloc/core';
import * as express from 'express';
import { Gauge, Registry } from 'prom-client';
import { flattenObject } from '../internal';
import { PROM_COMPOSED_METRIC_LABELS, getPrometheusMetricName } from './util';

/** Default listen port for a Prometheus scrapable endpoint. */
export const DEFAULT_PROMETHEUS_COLLECTOR_MANAGER_PORT = 3000;

/** Default path for a Prometheus scrapable endpoint. */
export const DEFAULT_PROMETHEUS_COLLECTOR_MANAGER_PATH = '/metrics';

/** Configuration options for a {@link PrometheusComposedMetricsCollectorManager}. */
export interface PrometheusCollectorManagerConfig {

    /** The port, where the REST API should listen for Prometheus scrape requests. */
    port?: number;

    /** The path for the Prometheus scrape endpoint. */
    path?: string;

}

class SharedGauge {

    readonly metricName: string;

    private useCount = 1;

    private gauge: Gauge<string>;

    /**
     * Creates a new `SharedGauge` with a `useCount` of `1`.
     */
    constructor(
        metricName: string,
        private registry: Registry,
        private onDestroyCallback: (sharedGauge: SharedGauge) => void,
    ) {
        this.metricName = metricName;
        this.gauge = new Gauge({
            name: metricName,
            help: `Polaris ComposedMetric ${metricName}`,
            registers: [ registry ],
            labelNames: [
                PROM_COMPOSED_METRIC_LABELS.gvkLabel,
                PROM_COMPOSED_METRIC_LABELS.namespaceLabel,
                PROM_COMPOSED_METRIC_LABELS.targetNameLabel,
                PROM_COMPOSED_METRIC_LABELS.propertyKeyLabel,
            ],
        });
    }

    set(sample: Sample<any>, labels: Record<string, string>): void {
        const flattened = flattenObject(sample.value);
        Object.keys(flattened).forEach(propKey => {
            const value = flattened[propKey];
            const propLabels = {
                ...labels,
                [PROM_COMPOSED_METRIC_LABELS.propertyKeyLabel]: propKey,
            };
            this.gauge.set(propLabels, value);
        });
    }

    incrementUseCount(): void {
        ++this.useCount;
    }

    decrementUseCount(): void {
        --this.useCount;
        if (this.useCount <= 0) {
            this.onDestroyCallback(this);
            this.registry.removeSingleMetric(this.metricName);
        }
    }

}

class PrometheusComposedMetricCollector<V> implements ComposedMetricCollector<V> {

    private labels: Record<string, string>;

    constructor(
        metricType: ComposedMetricType<V, ComposedMetricParams>,
        params: ComposedMetricParams,
        private sharedGauge: SharedGauge,
    ) {
        sharedGauge.incrementUseCount();
        this.labels = {
            [PROM_COMPOSED_METRIC_LABELS.gvkLabel]: ObjectKind.stringify(params.sloTarget),
            [PROM_COMPOSED_METRIC_LABELS.namespaceLabel]: params.namespace,
            [PROM_COMPOSED_METRIC_LABELS.targetNameLabel]: params.sloTarget.name,
        };
    }

    collect(sample: Sample<V>): void {
        this.sharedGauge.set(sample, this.labels);
    }

    dispose(): void {
        this.sharedGauge.decrementUseCount();
    }

}

/**
 * Creates `ComposedMetricCollectors` for Prometheus and exposes the metrics on a Prometheus scrapable endpoint.
 */
export class PrometheusComposedMetricsCollectorManager implements ComposedMetricCollectorFactory {

    private config: PrometheusCollectorManagerConfig;

    private server: Server;

    private registry: Registry;

    private sharedGauges: Map<string, SharedGauge>;

    get isActive(): boolean {
        return !!this.server;
    }

    /**
     * Starts the manager and the scrape endpoint.
     */
    start(config: PrometheusCollectorManagerConfig): void {
        this.config = {
            port: config.port || DEFAULT_PROMETHEUS_COLLECTOR_MANAGER_PORT,
            path: config.path ?? DEFAULT_PROMETHEUS_COLLECTOR_MANAGER_PATH,
        };
        this.registry = new Registry();
        this.sharedGauges = new Map();

        const expressApp = express();
        expressApp.get(this.config.path, (req, res) => {
            res.set('Content-Type', this.registry.contentType);
            this.registry.metrics()
                .then(metrics => {
                    Logger.log('Scrape request - sending response:', metrics);
                    res.end(metrics);
                })
                .catch(err => res.status(500).end(err));
        });
        this.server = expressApp.listen(this.config.port, () => Logger.log(`Server listening on http://0.0.0.0:${this.config.port}${this.config.path}`));
    }

    /**
     * Stops the manager and the scrape endpoint.
     */
    stop(): void {
        this.server.close();
        this.registry.clear()
        this.server = null;
        this.registry = null;
        this.sharedGauges = null;
        this.config = null;
    }

    createCollector<M extends ComposedMetricType<V, ComposedMetricParams>, V>(metricType: M, params: ComposedMetricParams): ComposedMetricCollector<V> {
        if (!this.isActive) {
            throw new ComposedMetricError('The PrometheusComposedMetricsCollectorManager has not been started.');
        }

        const sharedGauge = this.getOrCreateSharedGauge(metricType);
        const collector = new PrometheusComposedMetricCollector(metricType, params, sharedGauge);
        return collector;
    }

    private getOrCreateSharedGauge(metricType: ComposedMetricType<any>): SharedGauge {
        const metricName = getPrometheusMetricName(metricType);
        let sharedGauge = this.sharedGauges.get(metricName);
        if (!sharedGauge) {
            sharedGauge = new SharedGauge(
                metricName,
                this.registry,
                gauge => this.sharedGauges.delete(metricName),
            );
            this.sharedGauges.set(metricName, sharedGauge);
        }
        return sharedGauge;
    }

}
