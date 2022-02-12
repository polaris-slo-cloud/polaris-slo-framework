# Polaris SLO Cloud

The Polaris SLO Cloud project aims to provide Service Level Objectives (SLOs) for next generation Cloud computing.

Service Level Agreements (SLAs) are very common in cloud computing.
Each SLA consists of one or more Service Level Objectives, which are measurable capacity guarantees.
Most SLOs in today's cloud environments are very low-level (e.g., average CPU or memory usage, throughput).

Elasticity is a fundamental property of cloud computing.
It is commonly understood as provisioning more resources for an application as the load grows and deprovisioning resources as the demand drops.
However, this *resource elasticity* is only one of three possible [elasticity dimensions](https://ieeexplore.ieee.org/document/6015579).
The other two are *cost elasticity* (i.e., how much is a customer willing to pay for a service) and *quality elasticity* (e.g., the desired accuracy of the prediction of a machine learning model).

The goal of the Polaris project is to bring **high-level SLOs** to the cloud and enable customers to leverage all three levels of elasticity.


## Documentation

The main documentation can be found [here](./docs).


### Videos and Demos

This [video](https://www.youtube.com/watch?v=qRw_oyn_7Ss) provides an introduction to the Polaris Framework and the concepts behind it.

<a href="https://www.youtube.com/watch?v=Uh3VwT-urgk" target="_blank" rel="noopener">
    <img src="./assets/polaris-concepts-video-preview.png" alt="Polaris Framework Concepts Video Preview" width="640" height="360" border="10" />
</a>

The following videos showcase the demos of the Polaris Framework and its CLI:

* [End-to-end demo with reactive scaling of a workload](https://www.youtube.com/watch?v=qScTsLGyOi8)
* [Proactive scaling concepts and demo](https://www.youtube.com/watch?v=epgcMXS55tQ)

Additional demos can be found in [this repository](https://github.com/polaris-slo-cloud/polaris-demos).


### Scientific Publications

For more details and background, please see our scientific publications:

* [SLOC: Service Level Objectives for Next Generation Cloud Computing](https://ieeexplore.ieee.org/document/9146966) in *IEEE Internet Computing 24(3)*.
* [SLO Script: A Novel Language for Implementing Complex Cloud-Native Elasticity-Driven SLOs](https://ieeexplore.ieee.org/document/9590275) in *2021 IEEE International Conference on Web Services (ICWS)*.
* [A Novel Middleware for Efficiently Implementing Complex Cloud-Native SLOs](https://ieeexplore.ieee.org/document/9582269) in *2021 IEEE 14th International Conference on Cloud Computing (CLOUD)*.
* [Polaris Scheduler: Edge Sensitive and SLO Aware Workload Scheduling in Cloud-Edge-IoT Clusters](https://ieeexplore.ieee.org/document/9582166) in *2021 IEEE 14th International Conference on Cloud Computing (CLOUD)*.



## Motivating Example

Suppose a *service provider* (i.e., a cloud provider) wants to offer a Content Management System as-a-Service to its customers.
The CMS-as-a-Service that is being offered consists of the following services: a database, a headless backend (REST API only), and a frontend user interface.
Each service may expose one or more metrics, which can be simple ones like CPU usage or complex ones.
These metrics can be used by the service provider to set up SLOs.

<img src="./assets/motivating-example.svg" alt="Motivating Example">

*Service consumers*, i.e., Customers, who deploy the CMS-as-a-Service are not really interested in having an average CPU utiliztion of 80%, but instead want to have a "good performance for an acceptable cost".
Ideally they would like to specify a simple configuration that guarantees them a good performance without making their eyes pop out when they see the bill at the end of the month.

To this end, a [cost efficiency](http://www2.tisip.no/quis/public_files/wp7-cost-effectiveness-efficiency.pdf) SLO could be offered by the provider.
Based on [this article](https://ieeexplore.ieee.org/document/6319167), we define the cost efficiency of a cloud application as the number of requests per second faster than N milliseconds divided by the total cost of the service.
The cost efficiency could be exported by one or more services of the deployment as a *custom metric* and the service provider can use it as a base for creating an SLO that can be configured by the service consumers.
Polaris can then take care of automatically of scaling all services within the CMS-as-a-Service workload, based on this cost efficiency SLO.

A service consumer can now deploy the CMS-as-a-Service as a workload in his/her cloud subscription.
To configure the SLO, the consumer configures an *SLO Mapping*, which associates the cost efficiency SLO to the particular workload and supplies the desired cost efficiency as configuration values.


## Beyond Simple Scaling

Polaris does not only allow the development and configuration of complex SLOs, it also allows service consumers the choose the exact elasticity strategy they want to use when their SLO is violated.
The most common form (see [here](https://dl.acm.org/doi/10.1145/3148149)) of scaling in today's clouds is horizontal scaling, i.e., adding additional instances of a service (*scaling out*) or removing unneeded instances of the service (*scaling in*).

The service provider can offer multiple *elasticity strategies*, e.g., 
* Horizontal scaling (adding and removing instances)
* Vertical scaling (adding and removing resources, e.g., CPU and memory, to/from a single instance)
* A combination of horizontal and vertical scaling
* An elasticity strategy specifically tailored for a certain application

SLO Mappings allow service consumers to choose which elasticity strategy they want to use with their SLO, as long as their input/output data types match.


## Features

The Polaris project offers the following features:

* SLO Script, a language and framework for 
    * developing complex SLOs, based on one or more metrics
    * configuring these SLOs using SLO Mappings
    * developing composed metrics by aggregating other metrics
    * using predictions in metrics and SLOs to employ proactive scaling
    * developing custom elasticity strategies
* Generic elasticity strategies that can be used with multiple SLOs
* Generic SLOs that can be used with multiple elasticity strategies
* AI-based prediction models for metrics (see [polaris-ai](https://github.com/polaris-slo-cloud/polaris-ai)), usable as a composed metrics library
* SLO-aware Kubernetes pod scheduling (see [polaris-scheduler](https://github.com/polaris-slo-cloud/polaris-scheduler))

SLO Script consists of an orchestrator-independent core library and connector libraries for specific orchestrators.
Currently, there is a connector for Kubernetes.


## Repository Organization

This is a polyglot monorepository.
All code for this project is contained in this repository.

| Directory                | Contents |
|--------------------------|----------|
| [`deployment`](https://github.com/polaris-slo-cloud/polaris/tree/master/deployment) | YAML files for quickly deploying Polaris CRDs and controllers |
| [`docs`](https://github.com/polaris-slo-cloud/polaris/tree/master/docs)         | Documentation files |
| [`python`](https://github.com/polaris-slo-cloud/polaris/tree/master/python)     | Python code, e.g., predicted metric controller base |
| [`testbeds`](https://github.com/polaris-slo-cloud/polaris/tree/master/testbeds) | Configurations and demo applications, we use for testing |
| [`ts`](https://github.com/polaris-slo-cloud/polaris/tree/master/ts)             | TypeScript code, i.e., all SLO Script libraries, SLO controllers, etc. |



## Deployment

To quickly deploy the default set of elasticity strategies shipped with Polaris, open a terminal in the root folder of the repository and execute the following command:

```sh
kubectl apply -f ./deployment
```

This will deploy the `HorizontalElasticityStrategy` and `VerticalElasticityStrategy` CRDs and controllers.
More detailed build and deployment instructions can be found [here](./docs/deployment/).


## Maintaining gh-pages

The project's website is hosted using GitHub pages.

```sh
# Clone the polaris repository once more, this time into the ./gh-pages folder and check out the gh-pages branch.
git clone -b gh-pages git@github.com:polaris-slo-cloud/polaris.git ./gh-pages

# Run the update script to copy the current state from the docs folder to gh-pages and to regenerate the typedoc documentation.
./update-gh-pages.sh

# Go into the gh-pages directory and push the branch
cd gh-pages
git add .
git commit -m "Update gh-pages"
git push origin
```


## Our Users

The Polaris SLO Cloud project is actively used by the [orchestration layer](https://gitlab.com/rainbow-project1/rainbow-orchestration) of the [RAINBOW](https://rainbow-h2020.eu) project to bring complex SLOs to Fog Computing.
