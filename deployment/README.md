# Building and Deployment


## Prerequisites

To build the components of the Polaris project for local development or testing, you need to have the following tools installed:

* Node.JS v18.x+
* Docker 20.10+
* kubectl

Furthermore, you need a Kubernetes cluster, with a running Prometheus instance.
For testing locally, e.g., [minikube](https://minikube.sigs.k8s.io/docs/), [kind](https://kind.sigs.k8s.io/), or [MicroK8s](https://microk8s.io/) can be used.
For instructions on setting up a cluster for Polaris, please see our testbed [setup guide](https://github.com/polaris-slo-cloud/polaris/tree/master/testbeds/kubernetes).

The Polaris Kubernetes controllers should normally run as pods within the Kubernetes cluster.
For testing and development, they can also be run as a normal process on your development machine and connect to a local or remote cluster
When running Polaris components locally, the current context configured in your KUBECONFIG file is used to connect to the Kubernetes cluster.


## Quick Deployment

This section shows you how to quickly deploy the most common Polaris components.
To build and run/debug individual components, please see the next section.

1. Open a terminal in the main folder of the Polaris repository.
1. Run `kubectl apply -f ./deployment` to install the following components:
    * All Custom Resource Definitions
    * Horizontal Elasticity Strategy Controller
    * Vertical Elasticity Strategy Controller


## Building and Execution Tutorial

This section shows you how to build, run, and debug individual Polaris components.

1. Open a terminal in the [ts](https://github.com/polaris-slo-cloud/polaris/tree/master/ts) folder of the Polaris repository.
1. Install the dependencies:
    ```sh
    npm install
    ```
1. Generate the Custom Resource Definitions and apply them to the Kubernetes cluster:
    ```sh
    npm run gen-crds
    kubectl apply -f ./crds/kubernetes
    ```
1. Build the component(s) you are interested in using the following command:
    ```sh
    # Generic build command
    npx nx build <component-name>

    # E.g., build the Horizontal Elasticity Strategy controller
    npx nx build elasticity-horizontal-elasticity-strategy-controller

    # Alternatively, you can build the container image
    npm run docker:build:elasticity-horizontal-elasticity-strategy-controller
    ```
1. To run the built controller, you need to execute the `main.ts` file in the respective output folder. The build output of `npx nx build` is placed in the `ts/dist` folder, which is created during the build process. Make sure that your target Kubernetes cluster is set as the current context in your KUBECONFIG file.
    ```sh
    # E.g., run the Horizontal Elasticity Strategy controller
    node ./dist/apps/elasticity/horizontal-elasticity-strategy-controller/main.ts
    ```
    To debug a controller with Visual Studio Code, open the `ts` folder in VS Code and open a JavaScript Debug Terminal.
    Then, execute the above `node` command in that terminal.
    Additionally, there are some application-specific debug configurations in the [`ts/.vscode`](https://github.com/polaris-slo-cloud/polaris/tree/master/ts/.vscode) folder, which the the IDE will detect automatically.

If you want to test if all Polaris components build successfully after a change, you can execute the `build-all.sh` script in the `ts` folder.

For more details, please see the README in the [ts folder](https://github.com/polaris-slo-cloud/polaris/tree/master/ts) of the project.


## Publishing npm Packages

To publish the Polaris npm packages, do the following:

1. Open a terminal in the [ts](https://github.com/polaris-slo-cloud/polaris/tree/master/ts) folder of the Polaris repository.
1. Remove all existing dependencies (this clears the Nx CLI's build cache) and build output:
    ```sh
    rm -rf ./node_modules ./tmp ./dist
    ```
1. Reinstall the dependencies:
    ```sh
    npm install
    ```
1. Ensure that you are logged in to [npmjs.com](https://www.npmjs.com) or your local registry with a user that has the appropriate permissions.
1. Run the build and publish script:
    ```sh
    ./build-and-publish-npm-packages.sh
    ```


### Adding an SLO Mapping to the Cluster

Please see the "Generating and Applying an SLO Mapping Instance" step in our SLO tutorials, e.g., [here](https://github.com/polaris-slo-cloud/polaris-demos/tree/main/cost-eff-composed-metrics#generating-and-applying-an-slo-mapping-instance).
