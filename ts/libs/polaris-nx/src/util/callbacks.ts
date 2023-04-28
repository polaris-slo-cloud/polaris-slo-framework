import { GeneratorCallback } from '@nx/devkit';

/**
 * Executes the specified callbacks sequentially.
 *
 * @returns A promise that resolves when all callbacks have completed successfully.
 */
export function runCallbacksSequentially(...callbacks: GeneratorCallback[]): () => Promise<void> {
    return async () => {
        for (const callback of callbacks) {
            if (callback) {
                await callback();
            }
        }
    };
}
