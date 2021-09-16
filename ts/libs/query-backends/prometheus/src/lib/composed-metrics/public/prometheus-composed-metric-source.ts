import {
    ComposedMetricError,
    ComposedMetricMappingManager,
    ComposedMetricParams,
    ComposedMetricSourceBase,
    ComposedMetricType,
    DataType,
    LabelFilters,
    ObjectKind,
    PolarisRuntime,
    Sample,
    TimeInstantQuery,
    TimeSeriesInstant,
    TimeSeriesSource,
} from '@polaris-sloc/core';
import { Observable, from, of as observableOf } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PrometheusTimeSeriesSource } from '../../time-series';
import { unflattenObject } from '../internal';
import { PROM_COMPOSED_METRIC_LABELS, getPrometheusMetricNameWithoutPrefix } from './util';

/**
 * Specifies after how many value requests, the metric mapping should be checked again.
 *
 * See `PrometheusComposedMetricSource.maintainMetricMapping()`.
 */
const CHECK_MAPPING_INTERVAL = 10;

/**
 * A {@link ComposedMetricSource} that fetches composed metrics from Prometheus.
 *
 * **Naming Scheme**:
 * Composed metrics that are stored in Prometheus use the following naming scheme:
 * ```
 * polaris_composed_<metricType>{
 *
 *     // Group Version Kind string of the SLO Target resource.
 *     target_gvk="ObjectKind.stringify(sloTarget)",
 *
 *     // Namespace of the SLO Target resource (not to be confused with the `namespace` label added by Prometheus).
 *     target_namespace="sloTargetNamespace",
 *
 *     // Name of the SLO Target resource.
 *     target_name="sloTarget.name",
 *
 *     // Path of the composed value metric property that this time series represents.
 *     // Prometheus can only store single valued metrics. This is used to decompose
 *     // a multi-valued metric (i.e., an object) into multiple single values (see examples below).
 *     metric_prop_key="objPropKey"
 * }
 * ```
 *
 * `metricType` is the snake case version of the respective `ComposedMetricType.instance.metricTypeName`.
 * `metricType` can also be inferred from a MetricMapping CRD by using the snake case of `<crd_api_group>_<crd_kind_without_metric_mapping_suffix>`.
 * For example:
 * ```
 * // CRD:
 * apiVersion: metrics.polaris-slo-cloud.github.io/v1
 * kind: CostEfficiencyMetricMapping
 *
 * // Prometheus time series name:
 * polaris_composed_metrics_polaris_slo_cloud_github_io_cost_efficiency
 * ```
 *
 * **Multi-valued composed metric example**:
 * Since Prometheus supports only a single floating point value per metric sample, we store the properties of a composed metric object
 * using multiple samples and a classifier label. For example:
 * ```
 * // Composed metric object:
 * {
 *     a: 100,
 *     b: {
 *         c: 1.1,
 *         d: 2.2,
 *     }
 * }
 *
 * // Prometheus samples:
 * polaris_composed_example_metric{target_gvk="apps/v1/Deployment", target_namespace="default", target_name="test" metric_prop_key="a"} 100
 * polaris_composed_example_metric{target_gvk="apps/v1/Deployment", target_namespace="default", target_name="test" metric_prop_key="b.c"} 1.1
 * polaris_composed_example_metric{target_gvk="apps/v1/Deployment", target_namespace="default", target_name="test" metric_prop_key="b.d"} 2.2
 * ```
 *
 * **Single-valued composed metric example**:
 * Composed metrics that consist of a single value only use '.' as the `prop_key`.
 * ```
 * polaris_composed_single_valued_metric{target_gvk="apps/v1/Deployment", target_namespace="default", target_name="test" metric_prop_key="."} 100
 * ```
 *
 * @param V The TypeScript type that represents the values of the composed metric.
 */
export class PrometheusComposedMetricSource<V> extends ComposedMetricSourceBase<V> {

    /** The query that yields the composed metric. */
    protected query: TimeInstantQuery<number>;

    /** Total number times that this source has tried to query the composed metric. */
    private totalValueRequests = 0;

    constructor(
        protected metricType: ComposedMetricType<V, ComposedMetricParams>,
        protected metricParams: ComposedMetricParams,
        protected metricMappingManager: ComposedMetricMappingManager,
        polarisRuntime: PolarisRuntime,
    ) {
        super(polarisRuntime);
        const timeSeriesSource = polarisRuntime.metricsSourcesManager.getTimeSeriesSource(PrometheusTimeSeriesSource.fullName);
        this.query = this.createQuery(timeSeriesSource);
    }

    getValueStream(): Observable<Sample<V>> {
        return this.getDefaultPollingInterval().pipe(
            switchMap(() => this.maintainMetricMapping()),
            switchMap(() => this.query.execute()),
            map(result => this.assembleComposedMetric(result.results)?.samples[0]),
        );
    }

    /**
     * Ensures the existence of the `ComposedMetricMapping` for this composed metric on the first request and
     * subsequently on every nth request (e.g., on every 10th request).
     *
     * Since we do not implement a watch on the `ComposedMetricMapping` type of this composed metric, we periodically
     * check if the mapping has maybe been deleted on incorrectly modified.
     *
     * The ideal solution would be to watch every relevant `ComposedMetricMapping`, but this is difficult to realize
     * (which would also be the case with kubebuilder), because the `ComposedMetricMapping` kinds are generated dynamically.
     * This means that we would either
     * 1) need to watch potentially many `ComposedMetricMapping` kinds, even though we are not interested
     * in all their instances (e.g., for a generic metric, like total cost) or
     * 2) create a large number of watches, each with a selector specific to one mapping instance and each consuming a distinct web socket.
     *
     * @returns An observable that emits (and subsequently completes) when the mapping has been read/created/updated or if
     * this execution does not require a check.
     */
    private maintainMetricMapping(): Observable<void> {
        if (this.totalValueRequests++ % CHECK_MAPPING_INTERVAL === 0) {
            return from(this.metricMappingManager.ensureMappingExists(this.metricType, this.metricParams)).pipe(
                map(() => undefined),
            );
        }
        return observableOf(undefined);
    }

    private createQuery(timeSeriesSource: TimeSeriesSource): TimeInstantQuery<number> {
        const metricName = getPrometheusMetricNameWithoutPrefix(this.metricType);
        const gvk = ObjectKind.stringify(this.metricParams.sloTarget);

        return timeSeriesSource.select<number>(PROM_COMPOSED_METRIC_LABELS.metricPrefix, metricName)
            .filterOnLabel(LabelFilters.equal(PROM_COMPOSED_METRIC_LABELS.gvkLabel, gvk))
            .filterOnLabel(LabelFilters.equal(PROM_COMPOSED_METRIC_LABELS.namespaceLabel, this.metricParams.namespace))
            .filterOnLabel(LabelFilters.equal(PROM_COMPOSED_METRIC_LABELS.targetNameLabel, this.metricParams.sloTarget.name));
    }

    private assembleComposedMetric(results: TimeSeriesInstant<number>[]): TimeSeriesInstant<V> {
        if (results.length === 0) {
            return undefined;
        }

        const flattenedObj: Record<string, number> = {};
        results.forEach(metricProp => {
            const key = metricProp.labels[PROM_COMPOSED_METRIC_LABELS.propertyKeyLabel];
            if (!key) {
                throw new ComposedMetricError(
                    `Prometheus sample is missing the required ${PROM_COMPOSED_METRIC_LABELS.propertyKeyLabel} label`,
                    this.metricType,
                    this.metricParams,
                );
            }
            flattenedObj[key] = metricProp.samples[0].value;
        });
        const composedMetricObj: V = unflattenObject(flattenedObj);

        return {
            dataType: results.length > 1 ? DataType.Object : DataType.Float,
            metricName: this.metricType.metricTypeName,
            start: results[0].start,
            end: results[0].end,
            labels: {},
            samples: [ {
                timestamp: results[0].samples[0].timestamp,
                value: composedMetricObj,
            } ],
        };
    }

}
