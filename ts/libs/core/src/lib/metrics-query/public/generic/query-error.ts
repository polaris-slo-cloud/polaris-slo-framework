
/**
 * Generic error used by metrics queries.
 */
export class QueryError extends Error {

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(msg: string, public causingObject?: any, public cause?: Error) {
        super(msg);
    }

}
