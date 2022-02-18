
/**
 * Specifies if the current commands can also be executed by the globally installed CLI.
 */
export interface GlobalCliExecutionOptions {
    allowGlobalCli: boolean;

    /** If `true`, the CLI must be executed outside of a workspace. */
    requireExecutingOutsideOfWorkspace: boolean;
}

/**
 * Determines if the user supplied commands (`argv`) can be executed by the globally installed CLI.
 */
export function allowExecutingGlobalCli(argv: string[]): GlobalCliExecutionOptions {
    const globalExecOptions: GlobalCliExecutionOptions = {
        allowGlobalCli: false,
        requireExecutingOutsideOfWorkspace: false,
    };

    // The first two arguments are node and the path of main.js, so we are interested in the third argument.
    if (argv.length >= 3) {
        const arg = argv[2].toLowerCase();
        const isHelpCmd = arg === '--help';
        const isInitCmd = arg === 'init';
        globalExecOptions.requireExecutingOutsideOfWorkspace = isInitCmd;
        globalExecOptions.allowGlobalCli = isHelpCmd || isInitCmd;
    }

    return globalExecOptions;
}
