import { Subscription, interval, of as observableOf, throwError} from 'rxjs';
import { catchError, map, switchMap, take, takeUntil, tap, timeout } from 'rxjs/operators'
import { SloMappingSpec } from '../../../model';
import { getSlocRuntime } from '../../../runtime';
import { IndexByKey, ObservableStopper } from '../../../util';
import { ServiceLevelObjective, SloControlLoopError, SloEvaluationError } from '../common';
import { SLO_DEFAULT_TIMEOUT_MS, SloControlLoop, SloControlLoopConfig } from './slo-control-loop';

/**
 * The default SLO control loop implementation, which can be used for most orchestrators.
 */
export class DefaultSloControlLoop implements SloControlLoop {

    private stopper: ObservableStopper;

    private loopConfig: SloControlLoopConfig;

    private registeredSlos: Map<string, ServiceLevelObjective<any, any>> = new Map();

    private pendingSloEvaluations: Map<string, Subscription> = new Map();

    private slocRuntime = getSlocRuntime();

    get isActive(): boolean {
        return !!this.loopConfig;
    }

    addSlo(key: string, sloMapping: SloMappingSpec<any, any>): Promise<ServiceLevelObjective<any, any>> {
        if (this.getSlo(key)) {
            this.removeSlo(key);
        }

        let slo: ServiceLevelObjective<any, any>;
        const configAndAdd$ = observableOf(null).pipe(
            map(() => sloMapping.createSloInstance(this.slocRuntime)),
            switchMap(sloInstance => {
                slo = sloInstance;
                return slo.configure(sloMapping, null, this.slocRuntime);
            }),
            timeout(SLO_DEFAULT_TIMEOUT_MS),
            catchError(() => {
                const errorMsg = `SLO ${key} has timed out during configuration.`;
                console.error(errorMsg);
                throw new SloControlLoopError(this, errorMsg);
            }),
            map(() => {
                this.registeredSlos.set(key, slo);
                console.log(`Control loop: Successfully added new SLO: ${key}`);
                return slo;
            }),
            take(1),
        );

        return configAndAdd$.toPromise();
    }

    getSlo(key: string): ServiceLevelObjective<any, any> {
        return this.registeredSlos.get(key);
    }

    removeSlo(key: string): boolean {
        const slo = this.getSlo(key);
        if (slo) {
            const pendingEval = this.pendingSloEvaluations.get(key);
            if (pendingEval) {
                pendingEval.unsubscribe();
                this.pendingSloEvaluations.delete(key);
            }
            if (slo.onDestroy) {
                this.executeSafely(() => slo.onDestroy());
            }
            this.registeredSlos.delete(key);
            return true;
        }
        return false;
    }

    getAllSlos(): IndexByKey<ServiceLevelObjective<any, any>> {
        const allSlos: IndexByKey<ServiceLevelObjective<any, any>> = {};
        this.registeredSlos.forEach((slo, key) => allSlos[key] = slo);
        return allSlos;
    }

    start(config: SloControlLoopConfig): void {
        if (this.isActive) {
            throw new SloControlLoopError(this, 'The SLO control loop is already active.')
        }

        this.stopper = new ObservableStopper();
        this.loopConfig = config;

        if (this.loopConfig.sloTimeoutMs) {
            interval(this.loopConfig.sloTimeoutMs).pipe(
                takeUntil(this.stopper.stopper$),
            ).subscribe(() => this.stopPendingSloEvaluations());
        }

        this.loopConfig.interval$.pipe(
            tap(() => {
                // If no distinct timeout has been specified, stop pending SLO evaluations now.
                if (!this.loopConfig.sloTimeoutMs) {
                    this.stopPendingSloEvaluations();
                }
            }),
            takeUntil(this.stopper.stopper$),
        ).subscribe({
            next: () => this.executeLoopIteration(),
            error: (err) => {
                console.error(err);
                this.stop();
            },
        });
    }

    stop(): void {
        if (!this.isActive) {
            throw new SloControlLoopError(this, 'The SLO control loop cannot be stopped, because it is currently not active.')
        }

        this.stopper.stop();
        this.stopPendingSloEvaluations();
        this.stopper = null;
        this.loopConfig = null;
    }

    private executeLoopIteration(): void {
        this.registeredSlos.forEach((slo, key) => {
            const sloEval$ = observableOf(null).pipe(
                switchMap(() => this.loopConfig.evaluator.evaluateSlo(key, slo)),
                catchError(err => throwError(new SloEvaluationError(this, key, slo, err))),
                take(1),
            );
            this.pendingSloEvaluations.set(key, sloEval$.subscribe({
                next: () => console.log(`SLO ${key} evaluated successfully.`),
                error: err => console.error(err),
            }))
        });
    }

    private stopPendingSloEvaluations(): void {
        this.pendingSloEvaluations.forEach((pendingEval, key) => {
            pendingEval.unsubscribe();
            console.warn(`SLO evaluation of ${key} timed out.`);
        });
        this.pendingSloEvaluations.clear();
    }

    private executeSafely(fn: () => void): boolean {
        try {
            fn();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}
