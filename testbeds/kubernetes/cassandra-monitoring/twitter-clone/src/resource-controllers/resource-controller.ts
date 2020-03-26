import { Client } from 'cassandra-driver';
import { Express } from 'express';

export interface ResourceController {

    registerEndpoints(express: Express, cassandra: Client): void;

}
