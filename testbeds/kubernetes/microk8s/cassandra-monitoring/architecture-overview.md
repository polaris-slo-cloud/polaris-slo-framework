# Architecture Overview

This document provides an overview of this testbed in its default configuration, i.e., after going through the installation instructions in the [readme file](./Readme.md).


## Prometheus

Prometheus is deployed on a single pod using the prometheus operator, which is in turn installed using a helm chart.
It contains the default Kubernetes monitoring configuration provided by the operator.


## Persistence Layer

The persistence layer is made up of an Apache Cassandra cluster, which is deployed and managed through the [Instaclustr cassandra-operator](https://github.com/instaclustr/cassandra-operator).
The default configuration deploys three Cassandra nodes, each having 1 GB memory and 2 GB storage.
It also sets up a `cassandra-public` service, which creates the node port `30902` to allow access to the Cassandra pods over the Kubernetes load balancer.

The schema for the twitter-clone database can be found [here](./twitter-clone/db/schema/cql). It consists of a keyspace with a users table and three tweets tables, each configured with a different primary key to allow for fast searches based on tweet ID, poster username, and location, all ordered chronologically (newest first).


## Service Layer

The service layer consists of a simple Node.JS application inspired by Twitter that exposes a REST API for creating and getting users and tweets.

By default only a single pod is deployed, but that can be changed in the corresponding Kubernetes [deployment configuration](./twitter-clone/kubernetes/twitter-clone.yaml).
All pods are accessible through the `twitter-clone-service`, which is a node port configured to forward port `30903` on each Kubernetes node to a load balancer for the twitter-clone pods.

### Model Types

The twitter-clone REST API provides two model types: [User](./twitter-clone/src/model/user.ts) and [Tweet](./twitter-clone/src/model/tweet.ts).

### REST API

The following REST endpoints are provided:

|Method | URI                        | Request Body | Response Body | Purpose              |
|-------|----------------------------|:------------:|:-------------:|----------------------|
| `GET` | `/users/{username}`        | -            | `User`        | Get an existing user |
| `PUT` | `/users`                   | `User`       | `User`        | Create a new user    |
| `GET` | `/tweets`                  | -            | `Tweet[]`     | Get the 1000 latest tweets across all users |
| `GET` | `/tweets/{username}`       | -            | `Tweet[]`     | Get the 1000 latest tweets for the specified user |
| `PUT` | `/tweets/{username}`       | `Tweet`      | `Tweet`       | Create a new tweet using the specified user |


## Load Generator

The [load-generator](./load-generator) directory contains a JMeter test plan that can be used as a load generator.
It contains two thread groups (readers and writers), which are both configured to loop infinitely.
The number of threads, i.e., the number of simulated users, in each group can be configured in the user defined variables of the test plan.
The test plan assumes that the following four users exist: `test1`, `test2`, `test3`, and `test4`.

The `Readers` thread group performs the following actions:
* GET the latest 1000 tweets globally.
* Loop through all test users and get the latest 1000 tweets for each of them.

The `Writers` thread group performs the following action:
* Loop through all test users and create a new tweet with random data for each of them.
