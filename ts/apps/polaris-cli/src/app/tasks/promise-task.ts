import { Task } from './task';

/**
 * Executes a promise.
 */
 export class PromiseTask implements Task {

    constructor(public fn: () => Promise<void>) { }

    execute(): Promise<void> {
        return this.fn();
    }

}
