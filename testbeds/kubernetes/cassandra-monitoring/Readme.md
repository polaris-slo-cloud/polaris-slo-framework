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


Prometheus and Grafana are available on ports `30900` and `30901` respectively on the node, on which they have been deployed.

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