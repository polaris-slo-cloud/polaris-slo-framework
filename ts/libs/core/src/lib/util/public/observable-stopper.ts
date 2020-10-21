import { Observable, Subject } from 'rxjs';

/**
 * This helper can be used to control the completion of another observable.
 *
 * Example:
 * ```
 * private stopper = new ObservableStopper();
 *
 * ngOnInit(): void {
 *      this.myObservable$.pipe(
 *          ...,
 *          takeUntil(this.stopper.stopper$),
 *      ).subscribe((value) => {
 *          ...
 *      })
 * }
 *
 * ngOnDestroy(): void {
 *      this.stopper.stop();
 * }
 * ```
 */
export class ObservableStopper {

    private stopperSubj$ = new Subject<void>();

    // Used to conceal the Subject when providing the stopper publicly.
    private pubStopper$: Observable<void>;

    /**
     * The multicast observable that will emit and complete when `stop()` is called.
     */
    get stopper$(): Observable<void> {
        return this.pubStopper$;
    }

    constructor() {
        this.pubStopper$ = this.stopperSubj$.asObservable();
    }

    /**
     * @returns `true` if this `ObservableStopper` has been stopped, otherwise `false.
     */
    get isStopped(): boolean {
        return this.stopperSubj$.isStopped;
    }

    /**
     * Instructs all observables depending on this `ObservableStopper` to complete.
     */
    stop(): void {
        this.stopperSubj$.next();
        this.stopperSubj$.complete();
    }

}
