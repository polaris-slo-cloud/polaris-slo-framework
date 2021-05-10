import { execSync } from 'child_process';
import { Task } from './task';

const BUFFER_SIZE = 1024 * 100000;

/**
 * Used to configure a `RunProcessTask`.
 */
export interface ProcessConfig {

    /** The command that should be executed. */
    command: string;

    /**
     * The working directory of the process.
     *
     * If this is not specified, the current working directory of the CLI process is used.
     */
    workingDir?: string;

}

/**
 * Executes a process, connecting it to stdin, stdout, and stderr.
 */
export class RunProcessTask implements Task {

    constructor(public config: ProcessConfig) { }

    execute(): Promise<void> {
        execSync(this.config.command, {
            maxBuffer: BUFFER_SIZE,
            stdio: [0, 1, 2],
            cwd: this.config.workingDir || process.cwd(),
        });
        return Promise.resolve();
    }

}

/**
 * Executes a binary from an npm package.
 */
export class RunNpmBinaryTask extends RunProcessTask {

    constructor(config: ProcessConfig) {
        super({
            ...config,
            command: `npx ${config.command}`,
        });
    }

}
