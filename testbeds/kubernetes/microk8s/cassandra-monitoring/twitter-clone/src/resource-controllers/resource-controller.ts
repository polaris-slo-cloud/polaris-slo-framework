import { Express } from 'express';
import { CassandraInfo } from '../util/cassandra';

export interface ResourceController {

    registerEndpoints(express: Express, cassandra: CassandraInfo): void;

}
