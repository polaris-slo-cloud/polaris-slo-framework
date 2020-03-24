# Cassandra Monitoring Example

This folder contains an example stack for Kubernetes consisting of:
* a Cassandra cluster,
* Prometheus and Grafana for monitoring, and
* a frontend application for receiving requests and storing/retrieving data to/from Cassandra.

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


Prometheus and Grafana are available on ports `30900` and `30901` respectively on the node, on which they have been deployed.

Cassandra is available on port `30902`.

If you are running minikube, you can get the IP address of your node by running `minikube ip`.
Note that the scrape interval for Prometheus has been configured to 5 seconds, but the dashboards in Grafana need to be manually configured to refresh (top right corner of each dashboard).

See this [guide](https://github.com/instaclustr/cassandra-operator/blob/master/doc/op_guide.md) for further information about the cassandra-operator.
