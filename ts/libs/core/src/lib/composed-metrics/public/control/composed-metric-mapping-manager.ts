import { ApiObject, ComposedMetricMapping } from '../../../model';
import { ComposedMetricParams, ComposedMetricType } from '../common';

/**
 * Used to check for and configure `ComposedMetricMappings` in the orchestrator.
 */
export interface ComposedMetricMappingManager {

    /**
     * Ensures that a {@link ComposedMetricMapping} exists for the specified `metricType` and `params`.
     *
     * This method first checks if such a mapping already exists, updating it with `params`, if necessary.
     * If the mapping does not exist, a new one is created with `params` and `owner` as the owning `ApiObject`.
     *
     * @returns A promise that resolves to the new/existing `ComposedMetricMapping`.
     */
    ensureMappingExists<V, P extends ComposedMetricParams>(
        metricType: ComposedMetricType<V, P>,
        params: P,
        owner: ApiObject<any>,
    ): Promise<ComposedMetricMapping>;

}
