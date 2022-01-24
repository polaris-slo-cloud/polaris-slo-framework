# polaris-ai

This repository contains the tools developed in the framework of the polaris-slo-cloud project that belong to AI technologies.  

The main purpose of this repository is to develop the set of AI-enabled tools to ease and automate the management of SLO-aware clouds. These tools aim at allowing a better and more business oriented management of deployments by providing control over high-level SLOs or creating workload profiles based on metadata.  

The final aim is recommending or automating the resource profiling, as well as, predicting and performing autoscaling actions on the deployment to ensure its optimal use without violating any SLO.  

In this regard, the architecture for the AI technologies of the polaris-slo-cloud project is presented below:
![polaris-ai architecture](https://raw.githubusercontent.com/vikcas/figures/main/Polaris-ai_architecture_scheme.png)

In the previous scheme, the white and grey boxes represent the input data. In blue, there are the AI technologies that will be researched or used. The purple circles represent the tools that this project will develop. These aim to perform the actions that are represented in green, to finally obtain a complete cloud management system.

Currently, this repository contains the tools of three key steps: tools to treat [cloud workload data](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/data_extraction); tools to develop [metadata-based profiling](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/profiling) and tools to create and test deep learning models for predicting high-level SLO such as Efficiency, this can be found at the folder [high-level monitoring](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/predictive_monitoring).

The [`data_extraction` folder](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/data_extraction) contains the scripts to pre-process the input data. So far, we refer to the [Google cluster data (2011)](https://research.google/tools/datasets/cluster-workload-traces/) as our first primary source.

The core sections of this repository are the [metadata-based profiling](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/profiling) and the predictive [high-level monitoring](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/predictive_monitoring). In order to use the predictive high-level monitoring it is required to have specific workload data, and this is only available once the workload is running. Therefore, to solve this bootstrapping issue and offer personalized and adaptive management to new workloads, we have develop a metadata-based profiling, which based static and a priori data of the workload is able to determine which would be its requirements. The following figure shows the explained paradigm:

![polaris-ai overview](https://raw.githubusercontent.com/vikcas/figures/main/Polaris%20AI%20overview.png)

[Metadata-based profiling](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/profiling) folder includes means to generate workload profiles based on metadata, specifically on the metadata present in [Google cluster data (2011)](https://research.google/tools/datasets/cluster-workload-traces/). It also contains means to generate workload profiles based on their use of low-level cloud resources, this allows to generate a ground-truth to evaluate the metadata-based profiling.

The [`high-level monitoring` folder](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/predictive_monitoring) includes the means for generating and testing models. Specifically, we have so far the code to develop [LSTM](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/predictive_monitoring/lstm_approach) and [transformer](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/predictive_monitoring/transformer_approach) neural networks. These are ready to predict in a multi-step fashion high-level SLO, such as Efficiency, defined as the ratio between used and requested resources. 

