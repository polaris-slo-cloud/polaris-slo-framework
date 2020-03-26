import { Client } from 'cassandra-driver';
import { Express, Request, Response } from 'express';
import { CassandraInfo, DbMapper } from '../util/cassandra';
import { ResourceController } from './resource-controller';

export interface ResponseOptions {
    statusCode: number;
}

export abstract class ResourceControllerBase implements ResourceController {

    protected dbClient: Client;
    protected dbMapper: DbMapper;

    registerEndpoints(express: Express, cassandra: CassandraInfo): void {
        this.dbClient = cassandra.client;
        this.dbMapper = cassandra.mapper;
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

    protected async executeSafely(req: Request, res: Response, handler: () => Promise<void>): Promise<void> {
        console.log(`${req.method} ${req.url}`);

        return handler()
            .then(() => {})
            .catch(error => this.handleError(error, res));
    }

    protected handleError(error: any, expressResponse: Response): void {
        this.sendErrorResponse(expressResponse, error?.toString() || 'Internal Error');
    }

}
