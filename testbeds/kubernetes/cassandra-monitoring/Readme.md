# Cassandra Monitoring Example

This folder contains an example stack for Kubernetes consisting of:
* a Cassandra cluster,
* Prometheus and Grafana for monitoring, and
* a frontend application for receiving requests and storing/retrieving data to/from Cassandra.
* a load generator in form of an Apache JMeter test.

For details regarding the architecture, please see the [architecture overview](./architecture-overview.md).


## Installation

1. Install the [prometheus-operator helm chart](https://github.com/helm/charts/tree/master/stable/prometheus-operator):
    ```
    helm install prometheus-release-1 stable/prometheus-operator -f ./prometheus/helm-chart-config.yaml
    ```
2. Deploy the custom resource definitions for the [cassandra-operator](https://github.com/instaclustr/cassandra-operator), which is used for managing the Cassandra cluster:
    ```
    kubectl apply -f ./cassandra/operator/crds.yaml
    ```
3. Deploy the cassandra operator:
    ```
    kubectl apply -f ./cassandra/operator/bundle.yaml
    ```
4. Verify that the operator is running:
    ```
    kubectl get pods | grep cassandra-operator
    ```
5. Deploy the Cassandra cluster:
    ```
    kubectl apply -f ./cassandra/data-center.yaml
    ```
6. Apply the twitter-clone DB schema:
    ```
    cqlsh <Cassandra-node-IP> 30902 --file=./twitter-clone/db/schema.cql
    ```
7. Deploy the twitter-clone application
    ```
    kubectl apply -f ./twitter-clone/kubernetes/twitter-clone.yaml
    ```
8. Import the Cassandra dashboards into Grafana by navigating to `http://<node-id>:30901` and uploading the dashboards (taken from the [cassandra-exporter project](https://github.com/instaclustr/cassandra-exporter/tree/master/grafana/instaclustr)) from the folder `./cassandra/grafana`.


Prometheus and Grafana are available on ports `30900` and `30901` respectively on any of the nodes of the Kubernetes Cluster.

Cassandra is available on port `30902`.

twitter-clone is available on port `30903`.

If you are running minikube, you can get the IP address of your node by running `minikube ip`.
Note that the scrape interval for Prometheus has been configured to 5 seconds, but the dashboards in Grafana need to be manually configured to refresh (top right corner of each dashboard).

See this [guide](https://github.com/instaclustr/cassandra-operator/blob/master/doc/op_guide.md) for further information about the cassandra-operator.


## Load Generator Prerequisites

In order to be able to run the load generator, the following four users need to be created: `test1, `test2`, `test3`, and `test4`.
You can do this by issuing the following curl requests to a Kubernetes node that hosts a twitter-clone pod:

```
export TWITTER_CLONE_IP=<IP of a node running twitter-clone>
curl -X PUT $TWITTER_CLONE_IP:30903/users -H "Content-Type: application/json" -d '{ "username": "test1", "password": "secret", "email": "test@dsg.tuwien.ac.at"}'
curl -X PUT $TWITTER_CLONE_IP:30903/users -H "Content-Type: application/json" -d '{ "username": "test2", "password": "secret", "email": "test@dsg.tuwien.ac.at"}'
curl -X PUT $TWITTER_CLONE_IP:30903/users -H "Content-Type: application/json" -d '{ "username": "test3", "password": "secret", "email": "test@dsg.tuwien.ac.at"}'
curl -X PUT $TWITTER_CLONE_IP:30903/users -H "Content-Type: application/json" -d '{ "username": "test4", "password": "secret", "email": "test@dsg.tuwien.ac.at"}'
```

## Building the twitter-clone Docker Image

twitter-clone is packaged as a Docker image with the name `tuwiendsgsloc/tweeter-test`.
It is called `tweeter-test` to avoid legal issues with the copyrighted name Twitter.

To build and publish `twitter-clone` to DockerHub, execute the following steps:

1. Open a terminal in `./twitter-clone`.
2. Run `npm install`
3. If necessary, adjust the package version in [package.json](./twitter-clone/package.json).
4. Build twitter-clone and package it in a Docker image that is tagged with the current package version and the `latest` tag by running:
    ```
    npm run docker:build-latest
    ```
5. Push the Docker image to DockerHub:
    ```
    npm run docker:push-latest
    ```

