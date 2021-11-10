
export class PolarisCliError extends Error {

    constructor(message: string, public data?: any) {
        super(message);
    }

}
