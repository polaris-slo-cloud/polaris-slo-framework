# SLOC Kubernetes Go Components

This folder contains all SLOC Kubernetes components that are written in Go.

Currently, there is one elasticity strategy controller for the `HorizonalElasticityStrategy`.
This project was set up using [kubebuilder](https://github.com/kubernetes-sigs/kubebuilder).


## Building and Running

To build and run the horizontal elasticity strategy controller locally for testing:

1. Set the Kubernetes cluster, where you want to test the controller, as the current context in your KUBECONFIG file.
1. Open a terminal in the SLOC `go` directory.
1. Run `make` to build the controller.
1. Run `make install` to install the required CRDs in your Kubernetes cluster.
1. Run `./bin/manager`.
