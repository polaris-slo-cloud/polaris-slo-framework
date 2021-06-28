
/** The default value for `StabilizationWindow.scaleUpSeconds`. */
export const DEFAULT_SCALE_UP_STABILIZATION_WINDOW_SECONDS = 60;

/** The default value for `StabilizationWindow.scaleDownSeconds`. */
export const DEFAULT_SCALE_DOWN_STABILIZATION_WINDOW_SECONDS = 300;

/**
 * StabilizationWindow allows configuring the period of time that an elasticity strategy controller will
 * wait after applying the strategy once, before applying it again (if the SLO is still violated), to
 * avoid unnecessary scaling.
 *
 * For example, suppose that ScaleUpSeconds = 180 and a horizontal elasticity strategy scales out at time `t` due to an SLO violation.
 * At time `t + 20 seconds` the SLO's evaluation still results in a violation, but the elasticity strategy does not scale again, because
 * the stabilization window for scaling up/out has not yet passed. If the SLO evaluation at `t + 200 seconds` still results in a violation,
 * the controller will scale again.
 */
export class StabilizationWindow {

    /**
     * The number of seconds after the previous scaling operation to wait before
     * an elasticity action that increases resources (e.g., scale up/out) or an equivalent configuration change
     * can be issued due to an SLO violation.
     */
    scaleUpSeconds?: number;

    /**
     * The number of seconds after the previous scaling operation to wait before
     * an elasticity action that decreases resources (e.g., scale down/in) or an equivalent configuration change
     * can be issued due to an SLO violation.
     */
    scaleDownSeconds?: number;

    /**
     * @returns `window?.scaleUpSeconds`, if it is set, or its default value.
     */
    static getScaleUpSecondsOrDefault(window: StabilizationWindow): number {
        return window?.scaleUpSeconds ?? DEFAULT_SCALE_UP_STABILIZATION_WINDOW_SECONDS;
    }

    /**
     * @returns `window?.scaleDownSeconds`, if it is set, or its default value.
     */
    static getScaleDownSecondsOrDefault(window: StabilizationWindow): number {
        return window?.scaleDownSeconds ?? DEFAULT_SCALE_DOWN_STABILIZATION_WINDOW_SECONDS;
    }

}
