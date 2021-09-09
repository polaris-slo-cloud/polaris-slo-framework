import { of as observableOf, throwError } from 'rxjs';
import { catchError, finalize, switchMap, take, timeout } from 'rxjs/operators';
import { ElasticityStrategy, ElasticityStrategyKind, SloTarget } from '../../../model';
import { IndexByKey, Logger, executeSafely } from '../../../util';
import { ElasticityStrategyController, ElasticityStrategyExecutionError } from '../common';
import { ElasticityStrategyKindControllerPair, ElasticityStrategyWatchEventsHandler } from './elasticity-strategy-manager';

/**
 * Receives watch events for an elasticity strategy and executes the strategy's controller.
 */
export class DefaultElasticityStrategyWatchEventsHandler<O = any, T extends SloTarget = SloTarget, C = IndexByKey<any>>
    implements ElasticityStrategyKindControllerPair<O, T, C>, ElasticityStrategyWatchEventsHandler {

    /** Identifies the elasticity strategies that are currently being executed. */
    private executingStrategies: Set<string> = new Set();

    constructor(
        public kind: ElasticityStrategyKind<O, T, C>,
        public controller: ElasticityStrategyController<O, T, C>,
        private timeoutMs: number,
    ) {
    }

    onObjectAdded(obj: ElasticityStrategy<O, T, C>): void {
        executeSafely(() => this.processElasticityStrategy(obj));
    }

    onObjectModified(obj: ElasticityStrategy<O, T, C>): void {
        executeSafely(() => this.processElasticityStrategy(obj));
    }

    onObjectDeleted(obj: ElasticityStrategy<O, T, C>): void {
        if (this.controller.onElasticityStrategyDeleted) {
            executeSafely(() => this.controller.onElasticityStrategyDeleted(obj));
        }
    }

    private processElasticityStrategy(elasticityStrategy: ElasticityStrategy<O, T, C>): void {
        const elasticityStratId = this.getElasticityStrategyId(elasticityStrategy);
        if (this.executingStrategies.has(elasticityStratId)) {
            Logger.log('Skipping ElasticityStrategy, because it is already executing.', elasticityStrategy);
        }

        observableOf(null).pipe(
            switchMap(() => {
                this.executingStrategies.add(elasticityStratId);
                return this.controller.checkIfActionNeeded(elasticityStrategy);
            }),
            switchMap(actionNeeded => {
                if (actionNeeded) {
                    return this.controller.execute(elasticityStrategy);
                }
                return observableOf(null);
            }),
            catchError(err => throwError(new ElasticityStrategyExecutionError('Error executing ElasticityStrategy.', elasticityStrategy, err))),
            timeout(this.timeoutMs),
            catchError(err => {
                if (err instanceof ElasticityStrategyExecutionError) {
                    return throwError(err);
                }
                return throwError(new ElasticityStrategyExecutionError('The ElasticityStrategy execution has timed out.', elasticityStrategy));
            }),
            take(1),
            finalize(() => this.executingStrategies.delete(elasticityStratId)),
        ).subscribe({
            next: () => {},
            error: err => Logger.error(err),
        });
    }

    private getElasticityStrategyId(elasticityStrategy: ElasticityStrategy<any>): string {
        return `${elasticityStrategy.metadata.namespace}.${elasticityStrategy.metadata.name}`;
    }

}
