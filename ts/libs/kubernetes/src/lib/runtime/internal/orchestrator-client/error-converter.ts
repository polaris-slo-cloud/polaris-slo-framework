import { HttpError } from '@kubernetes/client-node';
import { OrchestratorRequestError } from '@polaris-sloc/core';

/**
 * Converts a Kubernetes-specific error to a Polaris `OrchestratorRequestError`.
 */
export function convertKubernetesErrorToPolaris(err: any): OrchestratorRequestError {
    if (err instanceof HttpError) {
        const statusCode = err.statusCode ?? 500;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const message: string = err.body?.message;

        return new OrchestratorRequestError(statusCode, message, err);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return new OrchestratorRequestError(0, 'Local error, check the `reason` property.', err);
}
