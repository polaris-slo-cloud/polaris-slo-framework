# Cost Efficiency SLO Profiling Experiment

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

To carry out the profiling experiment, there are multiple options:
1. Run the SLO controller in the cluster with a remote debugger attached.
2. Run the SLO controller on your development machine under the VS Code profiler. 


## Option 1: Run as Pod with Remote Debugging/Profiling

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


## Option 2: Run Locally with VS Code Profiler

1. Open Visual Studio Code in the [`ts`](../../../../ts) folder.
1. Connect to the Kubernetes cluster via SSH and forward the NodePort of the Prometheus service to a local port (e.g., 30900).
1. If you use a local port other than 30900, open [`ts/.vscode/launch.json](../../../../ts/.vscode/launch.json) and modify the `PROMETHEUS_PORT` environment variable of the "Debug cost-efficiency-slo-controller" launch configuration.
1. Go VS Code's "Run and Debug" tab and launch a debugging session of the "Debug cost-efficiency-slo-controller" configuration.
1. To start profiling, click the `REC` button next to `main.js` in the "Call Stack" pane.
