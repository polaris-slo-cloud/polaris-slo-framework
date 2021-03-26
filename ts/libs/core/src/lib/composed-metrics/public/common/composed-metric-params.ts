import { SloTarget } from '../../../model';

/**
 * Base interface for the parameter object that can is used for configuring a
 * `ComposedMetricSource` when obtaining it.
 */
export interface ComposedMetricParams {

    /**
     * The target workload, for which the metric should be retrieved.
     */
    sloTarget: SloTarget;

    /**
     * The namespace that the `SloTarget` is contained in.
     */
    namespace: string;

}
