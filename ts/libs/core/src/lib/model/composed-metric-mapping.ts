import { camelCase, startCase } from 'lodash';
import { ComposedMetricError, ComposedMetricParams, ComposedMetricType } from '../composed-metrics';
import { PolarisType } from '../transformation';
import { ApiObject } from './api-object';
import { ObjectKind } from './object-kind';
import { SloTarget } from './slo-target';

/**
 * Defines the configuration data for a composed metric mapping that is used for configuring
 * a composed metric controller.
 *
 * @param C The type that describes the composed metric's specific configuration parameters.
 * @param T (optional) The type of `SloTarget` that the composed metric can be computed for.
 */
export class ComposedMetricMappingSpec<C extends ComposedMetricParams, T extends SloTarget = SloTarget> {

    /**
     * Specifies the target that should be monitored.
     */
    @PolarisType(() => SloTarget)
    targetRef: T;

    /**
     * The configuration parameters, specific to this metric.
     *
     * @note If `C` is a class, the `@PolarisType` decorator needs to be applied in a subclass of `ComposedMetricMappingSpec`.
     */
    metricConfig: Omit<C, 'namespace' | 'sloTarget'>;
}

/**
 * Used to submit/retrieve an composed metric mapping to/from the orchestrator.
 *
 * To allow querying the orchestrator for all composed metric mappings associated with an SLO Mapping
 * (e.g., for the automatic generation of dashboards) we use dedicated labels in the `ComposedMetricMapping` to reference its owner `ApiObject`.
 * The owner is the `ApiObject` that triggered the creation of the `ComposedMetricMapping`, e.g., an `SloMapping` or another `ComposedMetricMapping`.
 *
 * The use of labels in addition of `ownerReferences` is necessary, because, e.g., in Kubernetes it is not possible to query all child objects of an owner
 * (https://github.com/kubernetes/kubernetes/issues/54498). The default label names are available in
 * the `POLARIS_API` constant object.
 *
 * Example:
 * ```
    labels:
      polaris-slo-cloud.github.io/owner-api-group: slo.polaris-slo-cloud.github.io
      polaris-slo-cloud.github.io/owner-api-version: v1
      polaris-slo-cloud.github.io/owner-kind: CostEfficiencySloMapping
      polaris-slo-cloud.github.io/owner-name: cms-cost-efficiency
    ownerReferences:
      - apiVersion: slo.polaris-slo-cloud.github.io/v1
        kind: CostEfficiencySloMapping
        name: cms-cost-efficiency
        uid: a6ae1e21-cf21-4b00-98f3-7371d07b6b95
 * ```
 *
 * @param T The type of {@link ComposedMetricMappingSpec} - decorate `spec` with `@PolarisType` if you set this parameter explicitly.
 */
export class ComposedMetricMapping<T extends ComposedMetricMappingSpec<any, any> = ComposedMetricMappingSpec<any>> extends ApiObject<T> {

    @PolarisType(() => ComposedMetricMappingSpec)
    spec: T;

    constructor(initData?: Partial<ComposedMetricMapping<T>>) {
        super(initData);
    }

    /**
     * Gets the {@link ObjectKind} for the `ComposedMetricMapping` for the specified `metricType`.
     *
     * @param metricType The {@link ComposedMetricType}, for which to get the `ObjectKind`.
     * @param override (optional) Provides the possibility to override one or more `ObjectKind` properties with custom values.
     * @returns A new {@link ObjectKind} instance.
     */
    static getMappingObjectKind(metricType: ComposedMetricType<any>, override?: Partial<ObjectKind>): ObjectKind {
        const gvkComponents = metricType.metricTypeName.split('/');
        if (gvkComponents.length !== 3) {
            throw new ComposedMetricError('Metric type does not conform to the `group/version/kind` naming standard.', metricType);
        }

        const gvk = new ObjectKind({
            group: override?.group ?? gvkComponents[0],
            version: override?.version ?? gvkComponents[1],
            kind: override?.kind ?? startCase(camelCase(gvkComponents[2])).replace(' ', '') + 'MetricMapping',
        });
        return gvk;
    }

}
