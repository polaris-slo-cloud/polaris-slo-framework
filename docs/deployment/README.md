# Building and Deployment


## Prerequisites

To build the components of the SLOC project for local development or testing, you need to have the following tools installed:

* Go 1.15.x+
* Node.JS v14.x+
* make
* Docker 20.10+
* kubectl
* kustomize

Furthermore, you need a Kubernetes cluster, with a running Prometheus instance.
For testing locally, e.g., [minikube](https://minikube.sigs.k8s.io/docs/), [kind](https://kind.sigs.k8s.io/), or [MicroK8s](https://microk8s.io/) can be used.
For deploying Prometheus, the [prometheus-operator helm chart](https://github.com/helm/charts/tree/master/stable/prometheus-operator) can be used.

The SLOC Kubernetes controllers should normally run as pods within the Kubernetes cluster.
For testing and development, they can also be run as a normal process on your development machine and connect to a local or remote cluster
When running SLOC components locally, the current context configured in your KUBECONFIG file is used to connect to the Kubernetes cluster.


## Building

A part of SLOC is implemented in Go and another part in TypeScript.
The [go](https://github.com/SLOCloud/SLOC/tree/master/go) and [ts](https://github.com/SLOCloud/SLOC/tree/master/ts) folders contain all code in the respective languages as a monorepository.


### Elasticity Strategies

The elasticity strategy controllers are written in Go and compiled into a single binary.
To build and run them, follow these steps:

1. Open a terminal in the [go](https://github.com/SLOCloud/SLOC/tree/master/go) folder of the SLOC repository.
1. Download all dependencies and build the controllers by running
```make```
1. Install the Custom Resource Definitions to your Kubernetes cluster by executing
```make install```
1. Run the controller:
```./bin/manager```


### SLO Controllers

The SLO controllers are implemented in TypeScript.
To build and run the cost efficiency SLO controller, which is demonstrated in [this video](https://www.youtube.com/watch?v=33P3YGOmnyI), follow these steps:

1. Open a terminal in the [ts](https://github.com/SLOCloud/SLOC/tree/master/ts) folder of the SLOC repository.
1. Install the dependencies:
```npm install```
1. Configure the connection to your Prometheus instance in [this file](https://github.com/SLOCloud/SLOC/tree/master/ts/apps/slo/cost-efficiency-slo-controller/src/main.ts).
1. Build the controller:
```npm run build slo-cost-efficiency-slo-controller --with-deps=true```
1. Make sure that you have the CRDs from the [elasticity strategies](#elasticity-strategies) installed.
1. Run the controller:
```node ./dist/apps/slo/cost-efficiency-slo-controller/main.js```


### Adding an SLO Mapping to the Cluster

Currently SLO mappings need to be serialized to YAML and manually added to the cluster.
In the future, there will be an automated controller for this.
To manually add an SLO mapping:

1. Add a new `.ts` file or open an [existing SLO mapping](https://github.com/SLOCloud/SLOC/tree/master/ts/apps/cli/sloc-k8s-serializer/src/app) .ts file in the [sloc-k8s-serializer](https://github.com/SLOCloud/SLOC/tree/master/ts/apps/cli/sloc-k8s-serializer) subproject.
1. Configure the SLO mapping.
1. Import and serialize it in the [`main.ts`](https://github.com/SLOCloud/SLOC/tree/master/ts/apps/cli/sloc-k8s-serializer/src/main.ts) file of the sloc-k8s-serializer.
1. Build the sloc-k8s-serializer:
```npm run build cli-sloc-k8s-serializer --with-deps=true```
1. Run the serializer and apply its YAML output to the cluster:
```node ./dist/apps/cli/sloc-k8s-serializer/main.js```
If the respective SLO's controller is running, it will pick up and enforce the SLO configured by the mapping.


### Run the CMS Workload

The [testbeds](https://github.com/SLOCloud/SLOC/tree/master/testbeds) include a deployment of the open-source headless CMS [Gentics Mesh](https://getmesh.io).
To install it, please follow [these steps](https://github.com/SLOCloud/SLOC/tree/master/testbeds/gentics-mesh/README.md).
The defined cost efficiency SLO mapping defined [here](https://github.com/SLOCloud/SLOC/tree/master/ts/apps/cli/sloc-k8s-serializer/src/app/cost-efficiency.slo.ts) is configured to operate on the deployed Gentics Mesh stateful set.
