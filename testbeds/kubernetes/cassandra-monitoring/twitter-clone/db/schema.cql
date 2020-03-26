CREATE KEYSPACE twitter WITH replication = { 'class': 'SimpleStrategy', 'replication_factor': 1 };

CREATE TYPE twitter.geo_location(
    latitude float,
    longitude float
);

CREATE TABLE twitter.users(
    username text,
    email text,
    password text,
    time_joined timestamp,
    PRIMARY KEY (username)
);

CREATE TABLE twitter.tweets(
    tweet_id timeuuid,
    username text,
    tweet_body text,
    time timestamp,
    location frozen<geo_location>,
    PRIMARY KEY (tweet_id)
);

CREATE TABLE twitter.tweets_by_user(
    tweet_id timeuuid,
    username text,
    tweet_body text,
    time timestamp,
    location frozen<geo_location>,
    PRIMARY KEY ((username), time)
) WITH CLUSTERING ORDER BY (time DESC);

CREATE TABLE twitter.tweets_by_location(
    tweet_id timeuuid,
    username text,
    tweet_body text,
    time timestamp,
    location frozen<geo_location>,
    PRIMARY KEY ((location), time)
) WITH CLUSTERING ORDER BY (time DESC);
