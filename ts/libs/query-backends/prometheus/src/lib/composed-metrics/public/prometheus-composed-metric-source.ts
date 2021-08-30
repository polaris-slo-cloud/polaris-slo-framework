import {
    ComposedMetricParams,
    ComposedMetricSourceBase,
    ComposedMetricType,
    LabelFilters,
    ObjectKind,
    PolarisRuntime,
    Sample,
    TimeInstantQuery,
    TimeSeriesSource,
} from '@polaris-sloc/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PrometheusTimeSeriesSource } from '../../time-series';
import { PROM_COMPOSED_METRIC_LABELS, getPrometheusMetricNameWithoutPrefix } from './util';

/**
 * A {@link ComposedMetricSource} that fetches composed metrics from Prometheus.
 *
 * Composed metrics that are stored in Prometheus use the following naming scheme:
 * ```
 * polaris_composed_<metricType>{gvk="ObjectKind.stringify(sloTarget)", namespace="sloTargetNamespace", target_name="sloTarget.name"}`
 * ```
 *
 * @param V The TypeScript type that represents the values of the composed metric.
 */
export class PrometheusComposedMetricSource<V> extends ComposedMetricSourceBase<V> {

    /** The query that yields the composed metric. */
    protected query: TimeInstantQuery<V>;

    constructor(
        protected metricType: ComposedMetricType<V, ComposedMetricParams>,
        protected metricParams: ComposedMetricParams,
        polarisRuntime: PolarisRuntime,
    ) {
        super(polarisRuntime);
        const timeSeriesSource = polarisRuntime.metricsSourcesManager.getTimeSeriesSource(PrometheusTimeSeriesSource.name);
        this.query = this.createQuery(timeSeriesSource);
    }

    getValueStream(): Observable<Sample<V>> {
        return this.getDefaultPollingInterval().pipe(
            switchMap(() => this.query.execute()),
            map(result => result.results[0]?.samples[0]),
        );
    }

    private createQuery(timeSeriesSource: TimeSeriesSource): TimeInstantQuery<V> {
        const metricName = getPrometheusMetricNameWithoutPrefix(this.metricType);
        const gvk = ObjectKind.stringify(this.metricParams.sloTarget);

        return timeSeriesSource.select(PROM_COMPOSED_METRIC_LABELS.metricPrefix, metricName)
            .filterOnLabel(LabelFilters.equal(PROM_COMPOSED_METRIC_LABELS.gvkLabel, gvk))
            .filterOnLabel(LabelFilters.equal(PROM_COMPOSED_METRIC_LABELS.namespaceLabel, this.metricParams.namespace))
            .filterOnLabel(LabelFilters.equal(PROM_COMPOSED_METRIC_LABELS.targetNameLabel, this.metricParams.sloTarget.name));
    }

}
