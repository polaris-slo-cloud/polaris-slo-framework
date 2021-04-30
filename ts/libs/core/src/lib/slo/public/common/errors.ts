import { SloControlLoop } from '../control';
import { ServiceLevelObjective } from './service-level-objective';


/**
 * This type of error is thrown by the `SloControlLoop`.
 */
export class SloControlLoopError extends Error {

    constructor(public controlLoop: SloControlLoop, message: string, public cause?: any) {
        super(message);
    }

}

/**
 * This type of error is thrown by the `SloControlLoop` if there is an error during the evaluation of an SLO.
 */
export class SloEvaluationError extends Error {

    constructor(
        public controlLoop: SloControlLoop,
        public sloKey: string,
        public slo: ServiceLevelObjective<any, any>,
        public sloEvaluationError: any,
        msg?: string,
    ) {
        super(msg || 'An error occured while evaluating the SLO.');
    }

}

/**
 * This error is thrown if a certain metric cannot be fetched.
 */
export class MetricUnavailableError extends Error {

    constructor(
        public metricName: string,
        public query?: any,
        msg?: string,
    ) {
        super(msg || `Metric ${metricName} is not available.`);
    }

}
