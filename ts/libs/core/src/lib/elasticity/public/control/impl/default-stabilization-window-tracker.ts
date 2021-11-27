import { ElasticityStrategy, StabilizationWindow } from '../../../../model';
import { ElasticityStrategyExecutionTracker, StabilizationWindowTracker } from '../../common';
import { DefaultElasticityStrategyExecutionTracker } from './default-elasticity-strategy-execution-tracker';

/**
 * Default `StabilizationWindowTracker` implementation.
 *
 * @param E The type of `ElasticityStrategy` for which to track the stabilization windows.
 */
export class DefaultStabilizationWindowTracker<E extends ElasticityStrategy<any>> implements StabilizationWindowTracker<E> {

    private executionTracker: ElasticityStrategyExecutionTracker<E, boolean> = new DefaultElasticityStrategyExecutionTracker();

    trackExecution(elasticityStrategy: E): void {
        this.executionTracker.addExecution(elasticityStrategy, true);
    }

    isOutsideStabilizationWindowForScaleUp(elasticityStrategy: E): boolean {
        const stabilizationWindow = StabilizationWindow.getScaleUpSecondsOrDefault(elasticityStrategy.spec.stabilizationWindow);
        return this.checkIfOutsideStabilizationWindow(elasticityStrategy, stabilizationWindow);
    }

    isOutsideStabilizationWindowForScaleDown(elasticityStrategy: E): boolean {
        const stabilizationWindow = StabilizationWindow.getScaleDownSecondsOrDefault(elasticityStrategy.spec.stabilizationWindow);
        return this.checkIfOutsideStabilizationWindow(elasticityStrategy, stabilizationWindow);
    }

    removeElasticityStrategy(elasticityStrategy: E): void {
        this.executionTracker.removeElasticityStrategy(elasticityStrategy);
    }

    evictExpiredExecutions(): void {
        this.executionTracker.evictExpiredExecutions();
    }

    private checkIfOutsideStabilizationWindow(elasticityStrategy: E, stabilizationWindowSec: number): boolean {
        const lastExecution = this.executionTracker.getLastExecution(elasticityStrategy);
        if (!lastExecution) {
            return true;
        }

        const timeDiffSec = (new Date().valueOf() - lastExecution.timestamp.valueOf()) / 1000;
        return timeDiffSec > stabilizationWindowSec;
    }

}
