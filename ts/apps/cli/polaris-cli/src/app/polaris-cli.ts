import { TaskExecutor } from './tasks';

/** Command used to execute the Nx CLI. */
export const NX_CLI = 'nx';

/** Polaris Nx CLI plugin. */
export const POLARIS_NX = '@polaris-sloc/polaris-nx';

export interface PolarisCli {

    /** The directory, where the Polaris CLI was started. */
    readonly startupDir: string;

    /**
     * The root directory of the current workspace.
     * This may be the same as `startupDir` or one of its parent directories.
     */
    readonly workspaceRootDir: string;

    /** Used to execute tasks from the CLI's commands. */
    readonly taskExecutor: TaskExecutor;

    /**
     * Executes the CLI.
     */
    run(): void;

}
