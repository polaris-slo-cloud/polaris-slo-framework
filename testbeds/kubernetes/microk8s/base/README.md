# Install Polaris Testbed Base with MicroK8S

## Install MicroK8s Base

1. Install [MicroK8s](https://microk8s.io) by running
    ```
    sudo snap install microk8s --classic
    ```
1. Run `microk8s status --wait-ready` and execute the suggested commands to add your user to the microk8s group. Then log out and log back in.
1. Run `microk8s status --wait-ready` again.
1. Follow this [guide](https://microk8s.io/docs/clustering) to add worker nodes to the cluster.
1. If `microk8s kubectl` commands execute slowly, run `microk8s inspect` on all nodes and follow the instructions of the warning messages (it will probably suggest to run `sudo iptables -P FORWARD ACCEPT`).
1. Enable the needed add-ons by running 
    ```
    microk8s enable dns rbac helm3 metrics-server
    ```
1. Create directories for the local storage class on all nodes.
Unfortunately we need to use local storage, because the hostPath volumes, which can be provisioned automatically by MicroK8s cannot ensure that a new pod gets scheduled on the same node as a previously claimed PV.
    ```shell
    # Node rainbow0:
    sudo -i
    cd /mnt/disks
    mkdir rainbow0-k8s-disk-01 && mkdir rainbow0-k8s-disk-02 && mkdir rainbow0-k8s-disk-03 && mkdir rainbow0-k8s-disk-04 && mkdir rainbow0-k8s-disk-05
    chmod a+rw rainbow0-k8s-disk-01 rainbow0-k8s-disk-02 rainbow0-k8s-disk-03 rainbow0-k8s-disk-04 rainbow0-k8s-disk-05

    # Node rainbow1:
    sudo -i
    cd /mnt/disks
    mkdir rainbow1-k8s-disk-01 && mkdir rainbow1-k8s-disk-02 && mkdir rainbow1-k8s-disk-03 && mkdir rainbow1-k8s-disk-04 && mkdir rainbow1-k8s-disk-05
    chmod a+rw rainbow1-k8s-disk-01 rainbow1-k8s-disk-02 rainbow1-k8s-disk-03 rainbow1-k8s-disk-04 rainbow1-k8s-disk-05

    # Node rainbow2:
    sudo -i
    cd /mnt/disks
    mkdir rainbow2-k8s-disk-01 && mkdir rainbow2-k8s-disk-02 && mkdir rainbow2-k8s-disk-03 && mkdir rainbow2-k8s-disk-04 && mkdir rainbow2-k8s-disk-05
    chmod a+rw rainbow2-k8s-disk-01 rainbow2-k8s-disk-02 rainbow2-k8s-disk-03 rainbow2-k8s-disk-04 rainbow2-k8s-disk-05
    ```
1. Create the default storage class and PVs:
    ```
    kubectl apply -f ./persistent-volumes/local-storage.yaml
    kubectl apply -f ./persistent-volumes/persistent-volumes.yaml
    ```
1. Run `microk8s config > ~/.kube/config` to get the KUBECONFIG file that can be used with an external version of kubectl.
1. If you are using SSH to connect to the machine running MicroK8s, do the following:
    * Copy `~/.kube/config` from your MicroK8s server to your local machine.
    * Set up SSH to forward a local port to port `16443` on the remote MicroK8s machine.
    * Open your local KUBECONFIG and merge the connection data from MicroK8s into it.
    * In your local KUBECONFIG, adjust the IP address and port of the `server` to match that of the local port forwarded via SSH
    * In your local KUBECONFIG, add `tls-server-name: kubernetes`
1. Install the [kube-prometheus-stack helm chart](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack). The deployed Prometheus is configured to watch all `ServiceMonitors` - if you want to limit them to a specific selector, change `prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues` and/or `prometheus.prometheusSpec.serviceMonitorSelector` in `./prometheus/values.yaml` accordingly.
    ```
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    kubectl create namespace monitoring
    helm install prometheus prometheus-community/kube-prometheus-stack -f ./prometheus/values.yaml
    ```
1. Install the ingress-nginx controller:
    ```
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace -f ./ingress-nginx/values.yaml --atomic
    ```
1. Import the [Grafana dashboards](https://github.com/kubernetes/ingress-nginx/tree/master/deploy/grafana/dashboards) from the `ingress-nginx/grafana-dashboards` folder.

## Install KubeCost

Follow these steps (based on this [guide](https://www.kubecost.com/install.html)) to install [Kubecost](https://www.kubecost.com), which also installs Prometheus and Grafana:

1. Create a kubecost namespace:
    ```
    kubectl create namespace kubecost
    ```
1. Add the kubecost Helm repository:
    ```
    helm repo add kubecost https://kubecost.github.io/cost-analyzer/
    helm repo update
    ```
1. Go to [http://kubecost.com/install](http://kubecost.com/install) to get a free token for installing Kubecost.
1. Install kubecost (the additional Prometheus scrape and relabeling config from [here](http://docs.kubecost.com/custom-prom) is already included in `./prometheus/values.yaml`):
    ```
    helm install kubecost kubecost/cost-analyzer --namespace=kubecost --values ./kubecost/values.yaml --set kubecostToken="<your token>"
    ```

ToDo: replace release: prometheus-release-1 -> release: prometheus in ts folder
