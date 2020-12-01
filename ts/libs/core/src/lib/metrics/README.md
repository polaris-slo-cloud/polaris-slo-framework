# Metrics Query API Requirements

## Data Types

* Instant vector
* Range vector
* Scalar
* String?

## Operations

* select/fetch => range vector
    * metric name
    * time range
* filter => range vector
    * field A **=**/**!=**/**<**/**>** "literal value"
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
