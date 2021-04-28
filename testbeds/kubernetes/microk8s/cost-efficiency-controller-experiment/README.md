# Cost Efficiency SLO Experiment

1. Make sure that the current context for `kubectl` is set to the cluster, where you want to run the experiment.
1. Open a terminal in the [`go`](../../../../go) folder.
1. Install the CRDs
    ```
    make install
    ```
1. Deploy the elasticity strategies controller:
    ```
    make deploy
    ```
1. Navigate to the [`ts/apps/slo/cost-efficiency-slo-controller`](../../../../ts/apps/slo/cost-efficiency-slo-controller) folder.
1. Deploy the Cost Efficiency SLO controller:
    ```
    kubectl apply -f ./manifests/kubernetes
    ```
