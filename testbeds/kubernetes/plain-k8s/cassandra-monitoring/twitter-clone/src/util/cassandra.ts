import { Client, mapping, QueryOptions } from 'cassandra-driver';

export type DbMapper = mapping.Mapper;
export type DbModelMapper<T> = mapping.ModelMapper<T>;

export const DEFAULT_QUERY_OPTS: QueryOptions = {
    prepare: true,
};

export interface CassandraInfo {
    client: Client;
    mapper: DbMapper;
}

/** Identifies the model types available through the DbMapper. */
export enum ModelType {
    Tweet = 'Tweet',
    User = 'User',
};

export function createDbMapper(cassandra: Client): DbMapper {
    return new mapping.Mapper(cassandra, {
        models: {
            [ModelType.Tweet]: { keyspace: 'twitter', tables: [ 'tweets', 'tweets_by_user', 'tweets_by_location' ] },
            [ModelType.User]: { keyspace: 'twitter', tables: [ 'users' ] },
        },
    });
}
