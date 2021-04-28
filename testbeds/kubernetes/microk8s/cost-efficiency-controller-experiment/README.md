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
1. Navigate to the [`testbeds/kubernetes/microk8s/cost-efficiency-controller-experiment`](./) folder.
1. Deploy the Cost Efficiency SLO controller with performance profiling:
    ```
    kubectl apply -f ./cost-efficiency-slo-controller
    ```
1. Apply 100 Cost Efficiency SLO mappings to generate load on the controller.
    ```
    ./slo-mappings/gen-mappings.sh ./slo-mappings/cost-efficiency-slo-mapping.template.yaml | kubectl apply -f -
    ```
