import { execSync } from 'child_process';
import { Task } from './task';

const BUFFER_SIZE = 1024 * 100000;

/**
 * Executes a process, connecting it to stdin, stdout, and stderr.
 */
export class RunProcessTask implements Task {

    constructor(private cmd: string) { }

    execute(): Promise<void> {
        execSync(this.cmd, {
            maxBuffer: BUFFER_SIZE,
            stdio: [0, 1, 2],
        });
        return Promise.resolve();
    }

}
