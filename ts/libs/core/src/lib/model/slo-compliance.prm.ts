import { initSelf } from '../util';

/**
 * Defines a generic mechanism for specifying how much an SLO is being violated or outperformed.
 */
export class SloCompliance {

    /**
     * Specifies how much the current state of the system complies with the SLO.
     *
     * This value must be specified as an integer, e.g., `50` meaning 50%,
     * `100` meaning 100%, `200` meaning 200%.
     *
     * If this value is `100`, the SLO is met exactly and no scaling action is required.
     *
     * If this value is greater than `100`, the SLO is violated
     * and scaling out/up is required.
     *
     * If this value is less than `100`, the system is performing
     * better than the SLO demands and scaling in/down will be performed.
     */
    currSloCompliancePercentage: number;

    /**
     * Specifies the tolerance around 100%, within which no scaling will be performed.
     *
     * For example, if tolerance is `10`, no scaling will be performed as long as `currSloCompliancePercentage`
     * is between `90` and `110`.
     */
    tolerance?: number;

    constructor(initData?: Partial<SloCompliance>) {
        initSelf(this, initData);
    }

}
