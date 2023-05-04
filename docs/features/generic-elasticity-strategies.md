# Generic Elasticity Strategies

The Polaris project contains a set of generic elasticity strategy controllers and the associated SLO Script types, which are commonly used.

Currently, we provide the following elasticity strategies:

* `HorizontalElasticityStrategy` ([Elasticity Strategy SLO Script type](https://github.com/polaris-slo-cloud/polaris-slo-framework/blob/master/ts/libs/common-mappings/src/lib/elasticity/horizontal-elasticity-strategy.prm.ts), [configuration](https://github.com/polaris-slo-cloud/polaris-slo-framework/blob/master/ts/libs/core/src/lib/model/common-elasticity-configs.prm.ts), [controller](https://github.com/polaris-slo-cloud/polaris-slo-framework/tree/master/ts/apps/elasticity/horizontal-elasticity-strategy-controller))
* `VerticalElasticityStrategy` ([Elasticity Strategy SLO Script type](https://github.com/polaris-slo-cloud/polaris-slo-framework/blob/master/ts/libs/common-mappings/src/lib/elasticity/vertical-elasticity-strategy.prm.ts), [configuration](https://github.com/polaris-slo-cloud/polaris-slo-framework/blob/master/ts/libs/core/src/lib/model/common-elasticity-configs.prm.ts), [controller](https://github.com/polaris-slo-cloud/polaris-slo-framework/tree/master/ts/apps/elasticity/vertical-elasticity-strategy-controller))

To learn how to create your own elasticity strategies, please visit the [polaris-demos](https://github.com/polaris-slo-cloud/polaris-demos) project.
