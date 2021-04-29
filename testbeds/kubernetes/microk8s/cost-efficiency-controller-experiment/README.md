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
1. Establish a port forwarding to the Node.JS inspect port of the SLO controller pod:
    ```
    kubectl port-forward -n sloc deployments/cost-efficiency-slo-controller 9229:9229
    ```
1. Open `chrome://inspect` in Google Chrome. It should detect the running SLO controller automatically. Then hit `inspect`.
1. In the `Profiling` tab of the Node.JS Developer tool window, start a profiling session.
1. Apply 100 Cost Efficiency SLO mappings to generate load on the controller.
    ```
    ./slo-mappings/gen-mappings.sh ./slo-mappings/cost-efficiency-slo-mapping.template.yaml | kubectl apply -f -
    ```
1. Stop the profiling session in Chrome and view the results.
