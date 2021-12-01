import { CostEfficiency, CostEfficiencyMetric, CostEfficiencyParams } from '@polaris-sloc/common-mappings';
import { ComposedMetricSource, ComposedMetricSourceFactory, MetricsSource, ObjectKind, OrchestratorGateway } from '@polaris-sloc/core';
import { RestApiCostEfficiencyMetricSource } from './rest-api-cost-efficiency-metric-source';

/**
 * Factory for creating `RestApiCostEfficiencyMetricSource` instances that supply metrics of type `CostEfficiencyMetric`.
 *
 * This factory supports `SloTarget` types that match `ReplicableSloTarget`.
 */
export class RestApiCostEfficiencyMetricSourceFactory implements ComposedMetricSourceFactory<CostEfficiencyMetric, CostEfficiency, CostEfficiencyParams> {

    /**
     * The list of supported `SloTarget` types.
     *
     * This list can be used for registering an instance of this factory for each supported
     * `SloTarget` type with the `MetricsSourcesManager`. This registration must be done if the metric source should execute in the current process,
     * i.e., metric source instances can be requested through `MetricSource.getComposedMetricSource()`.
     *
     * When creating a composed metric controller, the list of compatible `SloTarget` types is determined by
     * the `ComposedMetricMapping` type.
     */
    static supportedSloTargetTypes: ObjectKind[] = [
        new ObjectKind({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
        }),
        new ObjectKind({
            group: 'apps',
            version: 'v1',
            kind: 'StatefulSet',
        }),
        new ObjectKind({
            group: 'apps',
            version: 'v1',
            kind: 'ReplicaSet',
        }),
        new ObjectKind({
            group: 'apps',
            version: 'v1',
            kind: 'DaemonSet',
        }),
    ];

    readonly metricType = CostEfficiencyMetric.instance;

    readonly metricSourceName = `${CostEfficiencyMetric.instance.metricTypeName}/rest-api-cost-efficiency`;

    createSource(params: CostEfficiencyParams, metricsSource: MetricsSource, orchestrator: OrchestratorGateway): ComposedMetricSource<CostEfficiency> {
        return new RestApiCostEfficiencyMetricSource(params, metricsSource, orchestrator);
    }

}
