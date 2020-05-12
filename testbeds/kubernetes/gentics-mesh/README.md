# Gentics Mesh Testbed

For details about Gentics Mesh, see its [website](https://getmesh.io).

## Deploy ElasticSearch

This guide uses the ElasticSearch operator [Elastic Cloud on Kubernetes](https://www.elastic.co/downloads/elastic-cloud-kubernetes).

1. Install the operator:
    ```
    kubectl apply -f ./elasticsearch/all-in-one.yaml
    ```

2. Deploy an ElasticSearch cluster:
    ```
    kubectl apply -f ./elasticsearch/es-cluster.yaml
    ```



## Deploy Gentics Mesh

1. Add the Gentics repo to Helm:
    ```
    helm repo add gentics https://repo.apa-it.at/artifactory/gtx-helm/ --username <USER> --password <API_TOKEN>
    helm repo update
    ```

2. Set up the storage class and the persistent volumes:
    ```
    kubectl apply -f ./nfs-storage.yaml
    kubectl apply -f ./mesh-pvs.yaml
    ```

3. Deploy Mesh
    ```
    helm install -f ./mesh-values.yaml mesh gentics/gentics-mesh --namespace=mesh --atomic
    ```
