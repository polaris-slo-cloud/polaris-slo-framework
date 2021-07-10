import * as http from 'http';

/**
 * A set of commonly occurring error codes (not exhaustive).
 */
// eslint-disable-next-line no-shadow
export enum CommonOrchestratorErrorCodes {

    /** The request was invalid. */
    BadRequest = 400,

    /** The client has not authenticated (logged in) to the orchestrator. */
    Unauthorized = 401,

    /** The authenticated account does not have permission to perform the requested operation.  */
    Forbidden = 403,

    /**
     * The specified object was not found.
     *
     * This can mean that either the `ObjectKind` or the specific object does not exist.
     */
    NotFound = 404,

    /** The request has timed out. */
    RequestTimeout = 408,

    /**
     * Writing the object failed, because of a conflict.
     *
     * When creating a new object, this usually means that the object already exists.
     * When updating an object, this usually means that the object has been updated since it was last read.
     */
    Conflict = 409,

    /** An internal server error that has not been further specified has occurred. */
    InternalServerError = 500,

    /** The orchestrator is not able to handle the request. */
    ServiceUnavailable = 503,

}

/**
 * Describes an error that occurred while executing a request to the orchestrator.
 */
export class OrchestratorRequestError extends Error {

    /**
     * The HTTP status code returned by the request or `0` if the error
     * occurred in the local process.
     *
     * If the orchestrator does not use HTTP status codes, the respective orchestrator connector
     * library converts the orchestrator-specific error codes into HTTP status codes.
     */
    readonly statusCode: number;

    /**
     * The message corresponding to the `statusCode`.
     *
     * This property is set automatically according to the `statusCode`.
     *
     * For a descriptive error message, check the `message` property.
     */
    readonly statusMessage: string;

    /**
     * The internal error that caused this `OrchestratorRequestError`.
     *
     * This can be an error object from the orchestrator's native client library.
     */
    readonly reason?: Error;

    /**
     * Creates a new `OrchestratorRequestError`.
     *
     * @param statusCode The HTTP status code from the orchestrator's response.
     * @param reason (optional) The internal error that caused this `OrchestratorRequestError`.
     */
    constructor(statusCode: number, reason?: Error);
    /**
     * Creates a new `OrchestratorRequestError`.
     *
     * @param statusCode The HTTP status code from the orchestrator's response.
     * @param message (optional) A descriptive error message.
     * @param reason (optional) The internal error that caused this `OrchestratorRequestError`.
     */
    constructor(statusCode: number, message?: string, reason?: Error);
    constructor(statusCode: number, messageOrReason?: string | Error, reason?: Error) {
        super(typeof messageOrReason === 'string' ? messageOrReason : http.STATUS_CODES[statusCode]);
        this.statusCode = statusCode;
        this.statusMessage = http.STATUS_CODES[statusCode];
        this.reason = reason;
    }

}
