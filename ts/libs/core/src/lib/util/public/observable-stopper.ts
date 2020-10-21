/* eslint-disable @typescript-eslint/unified-signatures */
import { PartialObserver, Subject, Subscribable, Unsubscribable } from 'rxjs';

/**
 * This is a multicast observable that can be used to control the completion of another observable.
 *
 * Example:
 * ```
 * private stopper$ = new ObservableStopper();
 *
 * ngOnInit(): void {
 *      this.myObservable$.pipe(
 *          ...,
 *          takeUntil(this.stopper$),
 *      ).subscribe((value) => {
 *          ...
 *      })
 * }
 *
 * ngOnDestroy(): void {
 *      this.stopper$.stop();
 * }
 * ```
 */
export class ObservableStopper implements Subscribable<void> {

    private stopper$ = new Subject<void>();

    /**
     * @returns `true` if this `ObservableStopper` has been stopped, otherwise `false.
     */
    get isStopped(): boolean {
        return this.stopper$.isStopped;
    }

    subscribe(observer?: PartialObserver<void>): Unsubscribable;
    subscribe(next: null, error: null, complete: () => void): Unsubscribable;
    subscribe(next: null, error: (error: any) => void, complete?: () => void): Unsubscribable;
    subscribe(next: (value: void) => void, error: null, complete: () => void): Unsubscribable;
    subscribe(next?: (value: void) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
    subscribe(next?: any, error?: any, complete?: any): Unsubscribable {
        return this.stopper$.subscribe(next, error, complete);
    }

    /**
     * Instructs all observables depending on this `ObservableStopper` to complete.
     */
    stop(): void {
        this.stopper$.next();
        this.stopper$.complete();
    }

}
