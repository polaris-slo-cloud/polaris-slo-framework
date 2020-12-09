
/**
 * Generic error used by metrics queries.
 */
export class QueryError extends Error {

    constructor(msg: string, public causingObject?: any, public cause?: Error) {
        super(msg);
    }

}
