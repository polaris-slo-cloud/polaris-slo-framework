import { ServiceLevelObjective, SloOutput } from '../common';
import { SloEvaluator } from './slo-evaluator';

/**
 * This can be used as a superclass for a concrete `SloEvaluator` implementation.
 *
 * This class evaluates the SLO in a three step process:
 * 1. `onBeforeEvaluateSlo(key, slo)`, which may return a context object.
 * 2. `slo.evaluate()`
 * 3. `onAfterEvaluateSlo(currContext, sloOutput)`
 *
 * @param C Defines the type of context that will be used within the evaluator.
 */
export abstract class SloEvaluatorBase<C = any> implements SloEvaluator {

    /**
     * This method is called before an SLO is evaluated.
     * It may be used to do pre-processing, etc.
     *
     * @param key The key used to identify the SLO.
     * @param slo The `ServiceLevelObjective` that should be evaluated.
     * @returns A Promise that resolves to an optional context object that will be passed
     * to `onAfterEvaluateSlo()`.
     */
    onBeforeEvaluateSlo(key: string, slo: ServiceLevelObjective<any, any>): Promise<C> {
        return Promise.resolve(null);
    }

    /**
     * This method is called after the SLO has been evaluated.
     * It is responsible for applying the output to the orchestrator if necessary.
     *
     * @param currContext The context object that was created by `onBeforeEvaluateSlo()`.
     * @param sloOutput The output that `slo.evaluate()` has resolved to.
     * @returns A Promise that resolves when SLO output has been applied to the orchestrator if necessary.
     */
    abstract onAfterEvaluateSlo(currContext: C, sloOutput: SloOutput<any>): Promise<void>;

    evaluateSlo(key: string, slo: ServiceLevelObjective<any, any>): Promise<void> {
        let context: C;
        return this.onBeforeEvaluateSlo(key, slo)
            .then(ctx => {
                context = ctx;
                return slo.evaluate();
            }).then(output => this.onAfterEvaluateSlo(context, output));
    }

}
