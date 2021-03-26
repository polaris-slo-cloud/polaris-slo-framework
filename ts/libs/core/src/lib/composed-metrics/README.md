# Composed Metric Abstraction

This folder contains the abstractions for defining and obtaining *composed metrics*.

SLO Script has two types of metrics:
* **Raw Metrics** are time series obtained using the Raw Metrics Query API.
* **Composed Metrics** have been processed by a metrics library and may be composed of a combination of raw metrics.

Examples:
```TypeScript
// To use a custom metric, we will be able to do something like:
// The scoping to an sloTarget will be done by a factory object.
const composedMetricSrc = this.metricsSource.getComposedMetricSource(metricType, sloTarget, { metricName?, paramA, paramB });

// Get the latest value
const value$ = composedMetricSrc.getCurrentValue();
const valueProm = composedMetricSrc.getCurrentValueAsPromise();
const valueRange = composedMetricSrc.getValueRange(); // nor sure if we want this
```
