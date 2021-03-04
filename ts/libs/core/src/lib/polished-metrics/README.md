# Polished Metric Abstraction

This folder contains the abstractions for defining and obtaining *polished metrics*.

SLO Script has two types of metrics:
* **Raw Metrics** are time series obtained using the Raw Metrics Query API.
* **Polished Metrics** have been processed by a metrics library and may be composed of a combination of raw metrics.

Examples:
```TypeScript
// To use a custom metric, we will be able to do something like:
const polishedMetric = this.metricsSource.getPolishedMetricsSource().getByName('xyz', sloTarget);
// or
const polishedMetric = this.metricsSource.getPolishedMetricsSource().getByType(metricType, sloTarget);

// Get the latest value
const value$ = polishedMetric.getCurrentValue();
const valueProm = polishedMetric.getCurrentValueAsPromise();
const valueRange = polishedMetric.getValueRange(); // nor sure if we want this
```
