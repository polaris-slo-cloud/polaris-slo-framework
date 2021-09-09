import { Logger } from './logger';

/**
 * Executes the specified function in a try-catch block and logs the error,
 * if there is one.
 *
 * @param fn The function to be executed.
 * @returns `true` if the function executes successfully, `false` if there was an error.
 */
export function executeSafely(fn: () => void): boolean {
    try {
        fn();
        return true;
    } catch (err) {
        Logger.log(err);
        return false;
    }
}
