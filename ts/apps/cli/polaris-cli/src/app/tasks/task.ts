
/**
 * Represents an executable command in the CLI.
 */
export interface Task<R = void> {

    /**
     * Runs this task.
     *
     * @returns A promise that resolves to the result of the task.
     */
    execute(): Promise<R>;

}

