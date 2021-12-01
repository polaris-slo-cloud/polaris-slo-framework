import { ElasticityStrategy, StabilizationWindow } from '../../../../model';
import { ElasticityStrategyExecution, ElasticityStrategyExecutionTracker } from '../../common';

/**
 * Default `ElasticityStrategyExecutionTracker` implementation for tracking.
 *
 * @param E The type of `ElasticityStrategy` that is tracked.
 * @param O The type of operation or description of the operation that is executed for an elasticity strategy.
 */
export class DefaultElasticityStrategyExecutionTracker<E extends ElasticityStrategy<any>, O> implements ElasticityStrategyExecutionTracker<E, O> {

    /** The latest execution for each tracked elasticity strategy. */
    private trackedExecutions: Map<string, ElasticityStrategyExecution<E, O>> = new Map();

    get trackedElasticityStrategiesCount(): number {
        return this.trackedExecutions.size;
    }

    getLastExecution(elasticityStrategy: E): ElasticityStrategyExecution<E, O> {
        const id = this.getElasticityStrategyId(elasticityStrategy);
        return this.trackedExecutions.get(id);
    }

    addExecution(elasticityStrategy: E, operation: O): ElasticityStrategyExecution<E, O> {
        const id = this.getElasticityStrategyId(elasticityStrategy);
        const execution: ElasticityStrategyExecution<E, O> = {
            timestamp: new Date(),
            elasticityStrategy,
            operation,
        };
        this.trackedExecutions.set(id, execution);
        return execution;
    }

    removeElasticityStrategy(elasticityStrategy: E): void {
        const id = this.getElasticityStrategyId(elasticityStrategy);
        this.trackedExecutions.delete(id);
    }

    evictExpiredExecutions(): void {
        const nowMsec = new Date().valueOf();
        const expiredIds: string[] = [];
        this.trackedExecutions.forEach((execution, id) => {
            if (this.hasExpired(execution, nowMsec)) {
                expiredIds.push(id);
            }
        });

        expiredIds.forEach(id => this.trackedExecutions.delete(id));
    }

    private getElasticityStrategyId(elasticityStrategy: E): string {
        return `${elasticityStrategy.metadata.namespace}.${elasticityStrategy.metadata.name}`;
    }

    private hasExpired(execution: ElasticityStrategyExecution<E, O>, nowMsec: number): boolean {
        const scaleUpStabilizationWindow = StabilizationWindow.getScaleUpSecondsOrDefault(execution.elasticityStrategy.spec.stabilizationWindow);
        const scaleDownStabilizationWindow = StabilizationWindow.getScaleDownSecondsOrDefault(execution.elasticityStrategy.spec.staticConfig);
        const longestWindow = Math.max(scaleUpStabilizationWindow, scaleDownStabilizationWindow);
        const ageMsec = nowMsec - execution.timestamp.valueOf();
        return ageMsec > longestWindow;
    }

}
