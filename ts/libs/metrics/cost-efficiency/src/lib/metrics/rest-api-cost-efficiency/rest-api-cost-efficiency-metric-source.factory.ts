import { CostEfficiency, CostEfficiencyMetric, CostEfficiencyParams } from '@polaris-sloc/common-mappings';
import { ComposedMetricSource, ComposedMetricSourceFactory, ObjectKind, PolarisRuntime } from '@polaris-sloc/core';
import { RestApiCostEfficiencyMetricSource } from './rest-api-cost-efficiency-metric-source';

/**
 * Factory for creating `RestApiCostEfficiencyMetricSource` instances that supply metrics of type `CostEfficiencyMetric`.
 *
 * This factory supports `SloTarget` types that match `ReplicableSloTarget`.
 */
export class RestApiCostEfficiencyMetricSourceFactory implements ComposedMetricSourceFactory<CostEfficiencyMetric, CostEfficiency, CostEfficiencyParams> {

    /** The list of supported `SloTarget` types. */
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

    createSource(params: CostEfficiencyParams, polarisRuntime: PolarisRuntime): ComposedMetricSource<CostEfficiency> {
        return new RestApiCostEfficiencyMetricSource(params, polarisRuntime);
    }

}
