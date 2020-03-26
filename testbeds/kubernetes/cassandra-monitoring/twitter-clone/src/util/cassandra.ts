import { QueryOptions } from 'cassandra-driver';

export const DEFAULT_QUERY_OPTS: QueryOptions = {
    prepare: true,
};
