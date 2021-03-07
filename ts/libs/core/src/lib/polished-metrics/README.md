# Polished Metric Abstraction

This folder contains the abstractions for defining and obtaining *polished metrics*.

SLO Script has two types of metrics:
* **Raw Metrics** are time series obtained using the Raw Metrics Query API.
* **Polished Metrics** have been processed by a metrics library and may be composed of a combination of raw metrics.

Examples:
```TypeScript
// To use a custom metric, we will be able to do something like:
// The scoping to an sloTarget will be done by a factory object.
const polishedMetricSrc = this.metricsSource.getPolishedMetricSource(metricType, sloTarget, { metricName?, paramA, paramB });

// Get the latest value
const value$ = polishedMetricSrc.getCurrentValue();
const valueProm = polishedMetricSrc.getCurrentValueAsPromise();
const valueRange = polishedMetricSrc.getValueRange(); // nor sure if we want this
```
