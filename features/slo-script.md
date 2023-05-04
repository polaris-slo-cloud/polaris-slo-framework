# SLO Script


## Meta-Model

SLO Script has three major constructs in its meta model:

1. Service Level Objectives
1. Elasticity Strategies
1. SLO Mappings

One of the major goals of SLO Script is to decouple SLOs from elasticity strategies, i.e., to allow one SLO to trigger an elasticity strategy that the consumer chooses.

**`ServiceLevelObjective`** is one of the central constructs of the SLO Script language.
An instance of the `ServiceLevelObjective` construct defines and implements the business logic of an SLO and is configured by the service consumer using an `SloConfiguration`.
The `ServiceLevelObjective` uses metrics to determine the current state of the system and compare it to the parameters specified by the service consumer in the `SloConfiguration`.
The metrics are obtained using our strongly typed metrics query API, which abstracts a monitoring system, such as Prometheus.
The metrics may be low-level metrics, directly observable on the system or higher-level metrics (which can be packaged into libraries) or a combination of both.
Every evaluation of the `ServiceLevelObjective` produces an `SloOutput`, which describes how much the SLO is currently fulfilled and is used as a part of the input to an `ElasticityStrategy`.
Both, `ServiceLevelObjective` and `ElasticityStrategy`, define the type of `SloOutput` they produce or require respectively, which is one of the types needed for determining compatibility among them.

The **`ElasticityStrategy`** construct represents the implementation of an elasticity strategy.
It executes a sequence of elasticity actions to ensure that a workload fulfills an SLO.
Elasticity actions may include, e.g., provisioning or deprovisioning of resources, changing the types of resources used, or adapting the configuration of a service.
The input to an `ElasticityStrategy` is a corresponding `ElasticityStrategyConfiguration`, consisting of the `SloOutput` produced by the `ServiceLevelObjective` and static configuration provided by the consumer.
There is no direct connection between a `ServiceLevelObjective` and an `ElasticityStrategy`, which clearly shows that these two constructs are decoupled from each other.
A connection between them can only be established through additional constructs, i.e., `SloOutput` or `SloMapping`.

The **`SloMapping`** construct is used by the service consumer to establish the relationship between a `ServiceLevelObjective`, an `ElasticityStrategy`, and an `SloTarget`, i.e., the workload to which the SLO applies.
The `SloMapping` contains the SloConfiguration, which are the SLO-specific bounds that the consumer can define, the `SloTarget`, i.e., the workload to which the SLO is applied, and any static configuration for the chosen `ElasticityStrategy`.


## `StronglyTypedSLO`

When defining a `ServiceLevelObjective` using SLO Script’s `StronglyTypedSLO` mechanism, the service provider must first create an `SloConfiguration` data type that will be used by the service consumer to configure the `ServiceLevelObjective` and an `SloOutput` data type to describe its output.
While each `ServiceLevelObjective` will likely have its own `SloConfiguration` type, it is recommended to reuse an `SloOutput` data type for multiple `ServiceLevelObjective`s to allow for loose coupling between `ServiceLevelObjectives` and `ElasticityStrategies`.

To create the actual SLO, a service provider must create a class that implements the [ServiceLevelObjective](https://github.com/polaris-slo-cloud/polaris-slo-framework/blob/master/ts/libs/core/src/lib/slo/public/common/service-level-objective.ts) interface.
It takes three generic parameters to enable type safety:

* `C` is used for the type of `SloConfiguration` object that will carry the parameters from an `SloMapping`,
* `O` is used for the type of [SloOutput](https://github.com/polaris-slo-cloud/polaris-slo-framework/blob/master/ts/libs/core/src/lib/slo/public/common/slo-output.ts), which will be fed to the elasticity strategy, and
* `T` is used to define the type of target workload the SLO supports.

An `ElasticityStrategy` uses the same mechanism to define the type of `SloOutput` that it expects as input.

![Strongly Typed SLO Mechanism](../assets/slo-type-safety.svg)

The above Figure illustrates how the type safety feature of SLO Script works.
There are two sets of types: those determined by the `ServiceLevelObjective` and those determined by the `ElasticityStrategy`.
The `ServiceLevelObjective` defines that it needs a certain type of `SloConfiguration` (indicated by the yellow color) as configuration input.
The `SloConfiguration` defines the type of `SloTarget` (orange), which may be used to scope the SLO to specific types of workloads.
The `ElasticityStrategy` defines its type of `ElasticityStrategy`Configuration (purple), which, in turn, specifies the type of `SloOutput` (blue) that is required by the `ElasticityStrategy`.

Thus, the bridge between these two sets is the `SloOutput` type.
Once the service consumer has chosen a particular `ServiceLevelObjective` type, the possible SloTarget types are fixed because of the `SloConfiguration`.
Since the `ServiceLevelObjective` defines an `SloOutput` type, the set of compatible elasticity strategies is composed of exactly those `ElasticityStrategies` that have defined an `ElasticityStrategy`Configuration with the same `SloOutput` type as input.

Type checking is especially useful in enterprise scenarios, where hundreds of SLOs need to be managed.
Using YAML or JSON files for this purpose provides no way of verifying that the used SLOs, workloads, and elasticity strategies are compatible, while SLO Script provides this feature.
Furthermore, using a type safe language yields significant time savings when a set of SLOs and their mappings need to be refactored.

The SLO Script runtime calls the SLO instance at configurable intervals to check if the SLO is currently fulfilled or if the elasticity strategy needs to take corrective actions.
It may simply check if the metrics currently match the requirements of the SLO or it can use predictions and machine learning to determine if the SLO is likely to be violated in the near future and thus take proactive actions through the elasticity strategy.
The result of this operation is an instance of the defined `SloOutput` type, returned asynchronously through an RxJS Observable or a Promise.
