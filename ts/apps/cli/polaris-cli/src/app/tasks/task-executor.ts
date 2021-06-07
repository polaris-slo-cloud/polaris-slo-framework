import { Task } from './task';

/**
 * Executes `Task` instances.
 */
export interface TaskExecutor {

    /**
     * Executes a single task.
     */
    runTask<R>(task: Task<R>): Promise<R>;

    /**
     * Executes the specified tasks in sequence, discarding the results
     * that their promises resolve to.
     */
    runTasksSequentially(...tasks: Task<any>[]): Promise<void>;

}


export class DefaultTaskExecutor implements TaskExecutor {

    runTask<R>(task: Task<R>): Promise<R> {
        return task.execute();
    }

    async runTasksSequentially(...tasks: Task<any>[]): Promise<void> {
        if (!tasks) {
            return;
        }

        for (const task of tasks) {
            await this.runTask(task);
        }
    }

}
