import { Observable, of as observableOf } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ObservableOrPromise } from '../../../util';
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
     * @param key The key used to uniquely identify the SLO within the cluster.
     * @param slo The `ServiceLevelObjective` that should be evaluated.
     * @returns An observable that emits or a Promise that resolves to an optional context object that will be passed
     * to `onAfterEvaluateSlo()`.
     */
    onBeforeEvaluateSlo(key: string, slo: ServiceLevelObjective<any, any>): ObservableOrPromise<C> {
        return observableOf(null);
    }

    /**
     * This method is called after the SLO has been evaluated.
     * It is responsible for applying the output to the orchestrator if necessary.
     *
     * @note Normally, the `ServiceLevelObjective` is not needed by this method. If a specific implementation
     * does require the `ServiceLevelObjective` instance, it can be packed into the context object in `onBeforeEvaluateSlo()`.
     *
     * @param key The key used to uniquely identify the SLO within the cluster.
     * @param currContext The context object that was created by `onBeforeEvaluateSlo()`.
     * @param sloOutput The output that `slo.evaluate()` has resolved to.
     * @returns An observable or a Promise that emits/resolves when SLO output has been applied to the orchestrator if necessary.
     */
    abstract onAfterEvaluateSlo(key: string, currContext: C, sloOutput: SloOutput<any>): ObservableOrPromise<void>;

    evaluateSlo(key: string, slo: ServiceLevelObjective<any, any>): Observable<void> {
        let context: C;
        return observableOf(true).pipe(
            switchMap(() => this.onBeforeEvaluateSlo(key, slo)),
            switchMap(ctx => {
                context = ctx;
                return slo.evaluate();
            }),
            switchMap(output => this.onAfterEvaluateSlo(key, context, output)),
            take(1),
        );
    }

}
