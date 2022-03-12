import { types as CassandraTypes } from 'cassandra-driver';

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface Tweet {
    tweet_id: CassandraTypes.TimeUuid;
    username: string;
    tweet_body: string;
    time: Date;
    location: GeoLocation;
}
