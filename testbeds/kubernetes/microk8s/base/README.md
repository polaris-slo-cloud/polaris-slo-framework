# Install SLOC Testbed Base with MicroK8S

## Install MicroK8s Base

1. Install [MicroK8s](https://microk8s.io) by running
```
sudo snap install microk8s --classic
```
1. Run `microk8s status --wait-ready` and execute the suggested commands to add your user to the microk8s group. Then log out and log back in.
1. Run `microk8s status --wait-ready` again.
1. Follow this [guide](https://microk8s.io/docs/clustering) to add worker nodes to the cluster.
1. Enable the needed add-ons by running 
```
microk8s enable dns rbac storage helm3 ingress metrics-server prometheus
```
1. Since MicroK8s uses hostPath as the default storage provider, which creates directories as root (see [here](https://github.com/ubuntu/microk8s/issues/737)), the storage directory must be made world writable. Execute the following command on every node:
```
sudo chmod -R a+rwx /var/snap/microk8s/common/default-storage
```
1. Run `microk8s config > ~/.kube/config` to get the KUBECONFIG file that can be used with an external version of kubectl.
1. If you are using SSH to connect to the machine running MicroK8s, do the following:
    * Copy `~/.kube/config` from your MicroK8s server to your local machine.
    * Set up SSH to forward a local port to port `16443` on the remote MicroK8s machine.
    * Open your local KUBECONFIG and merge the connection data from MicroK8s into it.
    * In your local KUBECONFIG, adjust the IP address and port of the `server` to match that of the local port forwarded via SSH
    * In your local KUBECONFIG, add `tls-server-name: kubernetes`
1. If kubectl commands execute slowly, run `microk8s inspect` on all nodes and follow the instructions of the warning messages (it will probably suggest to run `sudo iptables -P FORWARD ACCEPT`).


## Install KubeCost

Follow these steps (based on this [guide](https://www.kubecost.com/install.html)) to install [Kubecost](https://www.kubecost.com), which also installs Prometheus and Grafana:

1. Run `kubectl create namespace kubecost`
1. Run `helm repo add kubecost https://kubecost.github.io/cost-analyzer/`
1. Run `helm repo update`
1. Run
```
helm install kubecost kubecost/cost-analyzer --namespace=kubecost --set kubecostToken="dC5wdXN6dGFpQGRzZy50dXdpZW4uYWMuYXQ=xm343yadf98",prometheus.server.persistentVolume.size="5Gi",persistentVolume.dbSize="2.0Gi",persistentVolume.size="2.0Gi"
```

## ToDo
* Create service YAMLs for exposing Prometheus and Grafana on NodePorts
* Copy service YAML for exposing Kubecost
* Try `helm install kubecost kubecost/cost-analyzer --namespace=kubecost --values kubecost-values.yaml` after deploying MicroK8s Prometheus
