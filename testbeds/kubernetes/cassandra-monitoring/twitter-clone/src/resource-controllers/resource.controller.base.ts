import { Client } from 'cassandra-driver';
import { Express, Response, Request } from 'express';
import { ResourceController } from './resource-controller';

export interface ResponseOptions {
    statusCode: number;
}

export abstract class ResourceControllerBase implements ResourceController {

    protected cassandra: Client;

    registerEndpoints(express: Express, cassandra: Client): void {
        this.cassandra = cassandra;
        this.registerEndpointsInternal(express);
    }

    protected abstract registerEndpointsInternal(express: Express): void;

    protected sendJsonResponse(expressResponse: Response, body: any, options: ResponseOptions = { statusCode: 200 }): void {
        expressResponse.status(options.statusCode);
        expressResponse.type('application/json');
        const bodyStr = JSON.stringify(body, null, 4);
        expressResponse.send(bodyStr);
    }

    protected sendErrorResponse(expressResponse: Response, errorMsg: string, options: ResponseOptions = { statusCode: 500 }): void {
        expressResponse.status(options.statusCode);
        expressResponse.statusMessage = errorMsg;
        expressResponse.send();
    }

}
