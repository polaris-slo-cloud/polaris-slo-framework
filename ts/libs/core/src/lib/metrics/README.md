# Metrics Query API Specification


## Source Selection

* It must be possible to select from multiple data sources, e.g.:
    ```TypeScript
    sources.streamSight.select()
    sources.prometheus.select()
    // or
    metrics.from('StreamSight').select()
    ```


## Data Types

### DB Assumptions
We assume the following data model in the time series DB:
* Every time series can have labels, e.g.,
    * Labels in Prometheus
    * Text columns in InfluxDB (e.g., _measurement, _field)
    * Time series identifier labels in MQL (https://cloud.google.com/monitoring/mql/reference#tables)
* Every sample of a time series has a single value
    * The value in Prometheus
    * _value field in InfluxDB
    * The first value column in MQL
    * If the DB supports multiple values, the value is represented by an object in a SLOC TimeSeries


### SLOC Query API Data Types
PromQL:
* InstantVector 
    * (PromQL: a set of time series containing a single sample for each time series, all sharing the same timestamp)
* RangeVector
    * (PromQL: a set of time series containing a range of data points over time for each time series)

SLOC:
* `TimeSeries<T>`
    * Unique ID?
    * MetricName (e.g., kubelet_http_requests_total)
    * Map of labels and their values (e.g., method='POST', node='rainbow0')
    * Additional metadata? (e.g., a single measurement is calculated over the duration of 1 minute)
    * Start (timestamp of first sample)
    * End (timestamp of last sample)
    * DataType (string identifier)
    * `Samples<T>[]`
* `TimeSeriesInstant<T>`
    * Derives from `TimeSeries`
    * `Samples<T>[]` is limited to a single element.
* `Sample<T>`
    * Timestamp
    * Value (`T`)
        * **Important:** If a sample has multiple values (possible in Google MQL, called value columns), `T` should be an interface that contains a property for each possible value column.
* `T`
    * any basic TypeScript data type
    * any interface in case of multi-valued samples (possible in MQL)


## Operations

The output of all operations is `TimeSeries[]`.
We need to distinguish between TimeSeries that can contain only a single value (`TimeSeriesInstant`) and TimeSeries that may contain multiple values.

* `select(metricName)` => `TimeSeriesInstant[]` with ONLY the LATEST sample for each time series that has this metric.
* `select(metricName, range: {start, end})` => `TimeSeries[]` with multiple samples for each time series that has this metric.
* `filterLabels` (applies a filter on a label) => `TimeSeriesInstant[]` or `TimeSeries[]`, depending on input
* `filterValues` (applies a filter on the value) => `TimeSeriesInstant[]` or `TimeSeries[]`, depending on input

/////////////////// This part needs work!!!
* group by => multiple range vectors
* aggregate (a single range vector) in time window => instant vector/range vector/scalar
    * count
    * sum
    * mean
    * median
    * mode
    * min
    * max
    * variance
    * Nth percentile
* join???

/////////////////// End of part that needs work!!! (I need to add further examples)

Here are some examples of what a query could look like:

### Example 1
```TypeScript
// PromQL:
// kubelet_http_requests_total{method='POST', node='rainbow0'}
metrics.from(PROMETHEUS)
    .select('kubelet_http_requests_total')
    .filter(Filters.regexEq('method', 'POST.*')) // Syntax option 1
    .filter(eq({field: 'node', value: 'rainbow0'})) // Syntax option 2
    .filter('auth', Filters.eq('abc')); // Syntax option 3
```
**PromQL Output:** a single InstantVector with the latest sample for each time series.

**SLOC API Output:** `TimeSeriesInstant[]`, where the `samples` array of each `TimeSeries` contains a single sample.


### Example 2
```TypeScript
// PromQL:
// kubelet_http_requests_total{method='POST', node='rainbow0'}[1h]
metrics.from(PROMETHEUS)
    .select('kubelet_http_requests_total', TimeRange.fromHours(-1)) // fromHours(-1) returns e.g., { start: timeStamp, end: timeStamp }
    .filter(Filters.regexEq('method', 'POST.*'))
```
**PromQL Output:** a single RangeVector, which is made up of an array of sample values for each time series.

**SLOC API Output:** `TimeSeries[]`, where the `samples` array of each `TimeSeries` contains multiple samples.
