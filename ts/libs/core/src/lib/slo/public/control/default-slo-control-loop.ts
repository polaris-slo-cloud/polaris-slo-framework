import { of as observableOf, throwError} from 'rxjs';
import { catchError, map, switchMap, take, takeUntil, tap, timeout } from 'rxjs/operators'
import { SloMapping, SloMappingSpec } from '../../../model';
import { DefaultMicrocontrollerFactory, MicrocontrollerFactory } from '../../../runtime/public/microcontroller-factory';
import { getSlocRuntime } from '../../../runtime/public/sloc-runtime/sloc-runtime';
import { IndexByKey, ObservableStopper } from '../../../util';
import { ServiceLevelObjective, SloControlLoopError, SloEvaluationError } from '../common';
import { DefaultSloWatchEventsHandler } from './default-slo-watch-events-handler';
import { SLO_DEFAULT_TIMEOUT_MS, SloControlLoop, SloControlLoopConfig, SloWatchEventsHandler } from './slo-control-loop';

interface RegisteredSlo {

    /** The SLO object that has been registered. */
    slo: ServiceLevelObjective<any, any>;

    /** Used to stop a pending evaluation of the SLO, if the SLO should be removed.  */
    stopper: ObservableStopper;

    /** The time the last evaluation of the SLO has started. */
    lastEvaluationStarted?: Date;

    /** The time the last evaluation of the SLO has successfully finished. */
    lastEvaluationFinished?: Date;

}

/**
 * The default SLO control loop implementation, which can be used for most orchestrators.
 */
export class DefaultSloControlLoop implements SloControlLoop {

    private stopper: ObservableStopper;

    private loopConfig: SloControlLoopConfig;

    private registeredSlos: Map<string, RegisteredSlo> = new Map();

    private slocRuntime = getSlocRuntime();

    private _watchHandler: SloWatchEventsHandler;

    readonly microcontrollerFactory: MicrocontrollerFactory<SloMappingSpec<any, any, any>, ServiceLevelObjective<any, any>> =
        new DefaultMicrocontrollerFactory();

    get isActive(): boolean {
        return !!this.loopConfig;
    }

    get watchHandler(): SloWatchEventsHandler {
        return this._watchHandler;
    }

    addSlo(key: string, sloMapping: SloMapping<any, any>): Promise<ServiceLevelObjective<any, any>> {
        if (this.registeredSlos.has(key)) {
            this.removeSlo(key);
        }

        let slo: ServiceLevelObjective<any, any>;
        const configAndAdd$ = observableOf(null).pipe(
            map(() => this.microcontrollerFactory.createMicrocontroller(sloMapping.spec)),
            switchMap(sloInstance => {
                slo = sloInstance;
                return slo.configure(sloMapping, this.slocRuntime.metricsSourcesManager, this.slocRuntime);
            }),
            catchError(err => {
                const errorMsg = `An error occurred while configuring SLO ${key}.`;
                console.error(errorMsg, err);
                throw new SloControlLoopError(this, errorMsg, err);
            }),
            timeout(SLO_DEFAULT_TIMEOUT_MS),
            catchError(() => {
                const errorMsg = `SLO ${key} has timed out during configuration.`;
                console.error(errorMsg);
                throw new SloControlLoopError(this, errorMsg);
            }),
            map(() => {
                this.registeredSlos.set(key, { slo, stopper: new ObservableStopper() });
                console.log(`Control loop: Successfully added new SLO: ${key}`);
                return slo;
            }),
            take(1),
        );

        return configAndAdd$.toPromise();
    }

    getSlo(key: string): ServiceLevelObjective<any, any> {
        return this.registeredSlos.get(key)?.slo;
    }

    removeSlo(key: string): boolean {
        const slo = this.registeredSlos.get(key);
        if (slo) {
            slo.stopper.stop();
            if (slo.slo.onDestroy) {
                this.executeSafely(() => slo.slo.onDestroy());
            }
            this.registeredSlos.delete(key);
            return true;
        }
        return false;
    }

    getAllSlos(): IndexByKey<ServiceLevelObjective<any, any>> {
        const allSlos: IndexByKey<ServiceLevelObjective<any, any>> = {};
        this.registeredSlos.forEach((slo, key) => allSlos[key] = slo.slo);
        return allSlos;
    }

    start(config: SloControlLoopConfig): void {
        if (this.isActive) {
            throw new SloControlLoopError(this, 'The SLO control loop is already active.')
        }

        this.stopper = new ObservableStopper();
        this.loopConfig = {
            ...config,
            sloTimeoutMs: config.sloTimeoutMs || SLO_DEFAULT_TIMEOUT_MS,
        };

        this._watchHandler = new DefaultSloWatchEventsHandler(this);

        this.loopConfig.interval$.pipe(
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
        this.stopper = null;
        this.loopConfig = null;
        this._watchHandler = null;
    }

    private executeLoopIteration(): void {
        this.registeredSlos.forEach((slo, key) => {
            const sloEval$ = observableOf(null).pipe(
                tap(() => slo.lastEvaluationStarted = new Date()),
                switchMap(() => this.loopConfig.evaluator.evaluateSlo(key, slo.slo)),
                tap(() => slo.lastEvaluationFinished = new Date()),
                catchError(err => throwError(new SloEvaluationError(this, key, slo.slo, err))),

                timeout(this.loopConfig.sloTimeoutMs),
                catchError(err => throwError(new SloEvaluationError(this, key, slo.slo, err, 'The SLO evaluation has timed out.'))),

                // Allow stopping the evaluation if the SLO should be removed.
                takeUntil(slo.stopper.stopper$),
                // Allow stopping the evaluation if the control loop is stopped.
                takeUntil(this.stopper.stopper$),

                take(1),
            );
            sloEval$.subscribe({
                next: () => console.log(
                    `SLO ${key} evaluated successfully in ${slo.lastEvaluationFinished.valueOf() - slo.lastEvaluationStarted.valueOf()}ms.`,
                ),
                error: err => console.error(err),
            });
        });
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
