# Composed Metrics

Polaris supports two types of metric abstraction:
* **Raw Metrics** are time series obtained using the [Raw Metrics Query API](https://polaris-slo-cloud.github.io/polaris-slo-framework/typedoc/interfaces/core_src.TimeSeriesSource.html#select).
* **Composed Metrics** have been processed by a metrics library and may be composed of a combination of raw metrics.

Examples:
```TypeScript
// To use a custom metric, we will be able to do something like:
// The scoping to an sloTarget will be done by a factory object.
const composedMetricSrc = this.metricsSource.getComposedMetricSource(metricType, { sloTarget, namespace, paramA, paramB }, metricSourceName?);

// Get the latest value
const value$ = composedMetricSrc.getCurrentValue(); // Promise
const valueProm = composedMetricSrc.getValueStream(); // Observable
```


## Composed Metric Source Implementations

A `ComposedMetricSource` may be implemented in two ways

1. As a metric source integrated into an SLO controller through libraries. The computation of the metric occurs in the SLO controller process.
2. As a proxy for an out-of-process composed metric. The computation of the metric occurs in a dedicated controller. The `ComposedMetricSource` fetches the metric from this controller or a DB.

The first scenario requires only the implementation of the respective interfaces in a reusable npm library.

The second scenario can for example, read the metrics from a DB, where they are pushed by dedicated controllers.
E.g., Polaris supports the `PrometheusComposedMetricSource`, which reads composed metrics from Prometheus using the following naming scheme for the metrics: `polaris_composed_<metricType>{gvk="sloTargetObjectKind.toString()", namespace="xyz", target_name="slotarget.Name"}`
