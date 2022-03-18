# Predictions

One of the central features of the Polaris project, is the prediction of the evolvement of high-level metrics in the near future.
This allows elasticity strategies to not be triggered only reactively, but also proactively.
The predicted metrics will be exposed as composed metrics libraries.

To learn more about predictions in Polaris, please refer to the [polaris-ai](https://github.com/polaris-slo-cloud/polaris-ai) subproject.

## Predicted Metric Controller

Polaris provides a solution to feed the predictions into the monitoring system.
You can find more details on how to generate this in the [CLI](cli.md) docs!
This section will explain the inner workings and which parts are to be implemented.
We also provide a complete demo with video and code [here](https://github.com/polaris-slo-cloud/polaris-demos/tree/main/efficiency-demo) (checkout the `docs` folder!).

The Predicted Metric Controller consists of two programs.
The first one is a _Composed Metric Controller_ that calls the second component, the _AI Proxy_ via REST to fetch the next prediction and transforms it into
the selected _Composed Metric Type_.

The _AI Proxy_ queries raw data from the monitoring system, preprocesses it and calls an external AI service (i.e., [TF Serving](https://www.tensorflow.org/tfx/guide/serving)) and
returns the prediction.

The scaffolded code provides a basic implementation but leaves two main parts empty for custom logic:
1. In the _Composed Metric Controller_: the mapping of the AI prediction into the _Composed Metric Type_
2. In the _AI Proxy_:
    1. The metrics that should be fetched
    2. The preprocessing of the raw data into a format that is suitable for the deployed AI model


## Composed Metric Controller

This Composed Metric Controller is the same as any Polaris _Composed Metric Controller_ but includes boilerplate code that interacts with the _AI Proxy_.
Developers have to implement the following things:
1. Implement the `PredictionApiResponse` interface, which represents the raw response of the TF Serving instance.
2. Implement the `mapResponseToSample` function that maps a `PredictionApiResponse` into the composed metric type the controller was generated with.

## AI Proxy

### Steps of AI Proxy

In general the metrics store (i.e., Prometheus) scrapes the Composed Metric Controller. Upon scraping the Composed Metric Controller calls the via REST the AI Proxy and leads to executing the following steps:

1. REST API Layer
    * REST Server listening to invocations by the _Composed Metric Controller_.
    * Triggers and manages the inference process (i.e., invokes functions for querying, preprocessing and invoke the AI service). 
    * The AI Proxy receives in the request body: `target_gvk`, `target_name` and `target_namespace`
   
2. Query Raw Metrics
    * Fetches data from the metrics store (i.e., Prometheus) based on the Configuration (`request.json`).
    * Configuration is a list of Metrics that are in the provided (extendable) Metrics Catalogue (i.e., Polaris offers these Metrics via Prometheus).
    * Returns data as dictionary to preprocessing function.
   
3. Build input features
    * Custom implementation (i.e., domain/AI model specific re-scaling, etc.)
    * Receives data from Step 2 and creates a JSON Array that contains possibly multiple instances for the inference engine (i.e., each item in the array is one instance for the AI model). 

4. Call AI Service via REST
    * Custom implementation possible.
    * Base implementation for TF Serving.
    * Returns the result of the prediction which is then returned back to the Composed Metric Controller, which translates it into the Composed Metric Type. 

### AI Proxy project structure

The Python project is structured as follows and is based on the previously mentioned steps:
* `data`
  * Contains `metrics.json` which maps metric names to metric store queries, and `request.json` which contains the metric names that the AI Proxy should fetch.
* `invocation`
  * Implements the call to the AI service (i.e., TF Serving)
* `preprocessing`
  * Needs to be implemented - transforms the raw data into the model's input format
* `query`
  * Is called to fetch the raw metrics and includes a default implementation for Prometheus
* `main.py`
  * Starts the Flask REST server and calls each step sequentially (`query -> preprocessing -> invocation`)
