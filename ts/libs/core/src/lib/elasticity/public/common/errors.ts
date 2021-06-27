import { ElasticityStrategy } from '../../../model';

/**
 * Error to be thrown when there are problems during the execution of an elasticity strategy.
 */
export class ElasticityStrategyExecutionError extends Error {

    constructor(
        msg: string,
        public elasticityStrategy: ElasticityStrategy<any>,
        public cause?: Error,
    ) {
        super(msg)
    }

}
