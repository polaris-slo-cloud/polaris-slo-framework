import { ElasticityStrategy, ElasticityStrategyKind, SloTarget } from '../../../model';
import { IndexByKey } from '../../../util';
import { ElasticityStrategyController } from '../common';
import { ElasticityStrategyKindControllerPair, ElasticityStrategyWatchEventsHandler } from './elasticity-strategy-manager';

/**
 * Receives watch events for an elasticity strategy and executes the strategy's controller.
 */
export class DefaultElasticityStrategyWatchEventsHandler<O = any, T extends SloTarget = SloTarget, C = IndexByKey<any>>
    implements ElasticityStrategyKindControllerPair<O, T, C>, ElasticityStrategyWatchEventsHandler {

    constructor(
        public kind: ElasticityStrategyKind<O, T, C>,
        public controller: ElasticityStrategyController<O, T, C>,
        private timeoutMs: number,
    ) {
    }

    onObjectAdded(obj: ElasticityStrategy<any, SloTarget, IndexByKey<any>>): void {
        throw new Error('Method not implemented.');
    }

    onObjectModified(obj: ElasticityStrategy<any, SloTarget, IndexByKey<any>>): void {
        throw new Error('Method not implemented.');
    }

    onObjectDeleted(obj: ElasticityStrategy<any, SloTarget, IndexByKey<any>>): void {
        throw new Error('Method not implemented.');
    }



}
