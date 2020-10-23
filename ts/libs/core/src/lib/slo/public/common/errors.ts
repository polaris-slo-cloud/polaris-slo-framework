import { SloControlLoop } from '../control';
import { ServiceLevelObjective } from './service-level-objective';


/**
 * This type of error is thrown by the `SloControlLoop`.
 */
export class SloControlLoopError extends Error {

    constructor(public controlLoop: SloControlLoop, message: string) {
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
