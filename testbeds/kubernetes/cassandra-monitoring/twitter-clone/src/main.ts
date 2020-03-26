import { Client } from 'cassandra-driver';
import express from 'express';
import { convertToNumber, getEnvironmentVariable } from './util/environment';
import { UsersController } from './resource-controllers/users/users.controller';
import { ResourceController } from './resource-controllers/resource-controller';
import { TweetsController } from './resource-controllers/tweets/tweets.controller';

const config = {
    port: getEnvironmentVariable('LISTEN_PORT', convertToNumber) || 8080,
    cassandraNode: getEnvironmentVariable('CASSANDRA_NODE'),
    cassandraPort: getEnvironmentVariable('CASSANDRA_PORT', convertToNumber) || 9042,
    cassandraUser: getEnvironmentVariable('CASSANDRA_USER'),
    cassandraPassword: getEnvironmentVariable('CASSANDRA_PWD'),
};

if (!config.cassandraNode) {
    throw new Error(
        'No Cassandra node host specified. Please set the environment variable CASSANDRA_HOST to the host of the Cassandra node that this application should connect to.',
    );
}


function connectToDb(): Promise<Client> {
    console.log('Connecting to Cassandra...');

    const cassandraClient = new Client({
        contactPoints: [ `${config.cassandraNode}:${config.cassandraPort}` ],
        credentials: config.cassandraUser ? { username: config.cassandraUser, password: config.cassandraPassword } : undefined,
        localDataCenter: 'dc1',
        keyspace: 'twitter',
    });

    return cassandraClient.connect()
        .then(() => {
            console.log('Successfully connected to Cassandra DB.')
            return cassandraClient
        });
}

function initRestApi(cassandraClient: Client): void {
    const app = express();
    app.use(express.json());

    const controllers: ResourceController[] = [
        new UsersController(),
        new TweetsController(),
    ];
    controllers.forEach(controller => controller.registerEndpoints(app, cassandraClient));

    app.listen(config.port, () => {
        console.log(`Listening on port ${config.port}.`);
    });
}

async function init(): Promise<void> {
    const cassandra = await connectToDb();
    initRestApi(cassandra);
}


init();
