
/**
 * Represents an executable command in the CLI.
 */
export interface Task {

    /** Runs this command. */
    execute(): Promise<void>;

}

/**
 * Executes the specified commands in sequence.
 */
export async function runTasksSequentially(...tasks: Task[]): Promise<void> {
    if (!tasks) {
        return;
    }

    for (const task of tasks) {
        await task.execute();
    }
}
