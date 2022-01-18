import { ComposedMetricSource, ComposedMetricSourceFactory, MetricsSource, ObjectKind, OrchestratorGateway } from '@polaris-sloc/core';
import { CostEfficiency, CostEfficiencyMetric, CostEfficiencyParams } from '@polaris-sloc/common-mappings';
import { CostEfficiencyMetricSource } from './cost-efficiency.metric-source';

/**
 * Factory for creating `CostEfficiencyMetricSource` instances that supply metrics of type `CostEfficiencyMetric`.
 */
export class CostEfficiencyMetricSourceFactory implements ComposedMetricSourceFactory<CostEfficiencyMetric, CostEfficiency, CostEfficiencyParams> {
    // ToDo:
    // - Adapt this list, if necessary.
    // - To register this factory with the `MetricsSourcesManager` (needed if the metric source should execute in the current process
    //   and be available through `MetricSource.getComposedMetricSource()`, add the following code to your `initPolarisLib()` function
    //   or to your `main.ts`:
    //   ```
    //   CostEfficiencyMetricSourceFactory.supportedSloTargetTypes.forEach(
    //       sloTargetType => runtime.metricsSourcesManager.addComposedMetricSourceFactory(new CostEfficiencyMetricSourceFactory(), sloTargetType),
    //   );
    //   ```
    //
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

    // ToDo: Adapt this, if necessary.
    readonly metricSourceName = `${CostEfficiencyMetric.instance.metricTypeName}/generic-cost-efficiency`;

    createSource(params: CostEfficiencyParams, metricsSource: MetricsSource, orchestrator: OrchestratorGateway): ComposedMetricSource<CostEfficiency> {
        return new CostEfficiencyMetricSource(params, metricsSource, orchestrator);
    }
}
