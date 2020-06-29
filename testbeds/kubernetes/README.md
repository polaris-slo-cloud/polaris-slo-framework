# Kubernetes Testbed

This folder contains various parts of the DSG Kubernetes testbed.

Before deploying anything else, make sure that you have enough persistent volumes.
To do this, you can do the following:
```
kubectl apply -f ./persistent-volumes/local-storage.yaml
kubectl apply -f ./persistent-volumes/persistent-volumes.yaml
```
