import { SloTarget } from '../../../model';

/**
 * Base interface for the parameter object that can is used for configuring a
 * `PolishedMetricSource` when obtaining it.
 */
export interface PolishedMetricParams {

    /**
     * The target workload, for which the metric should be retrieved.
     */
    sloTarget: SloTarget;

    /**
     * The namespace that the `SloTarget` is contained in.
     */
    namespace: string;

}
