package v1

import (
	sloCrds "polaris-slo-cloud.github.io/polaris/apis/slo/v1"
)

// ElasticityStrategySpecBase should be embedded inline in an ElasticityStrategySpec.
//
// In addition to TargetRef field provided by this base type, the following fields must/may be added to an ElasticityStrategy spec:
// 	- `SloOutputParams` must be added to hold the output of the SLO.
//	- `StaticConfig` (optional) may be added to allow additional static configuration for the elasticity strategy.
type ElasticityStrategySpecBase struct {

	// Specifies the target on which to execute the elasticity strategy.
	TargetRef sloCrds.SloTarget `json:"targetRef"`

	// The output parameters resulting from the SLO execution.
	// Since we have no generics in Go (yet), this field needs to be added to the conrete ElasticityStrategySpec type.
	// SloOutputParams SloOutputType `json:"sloOutputParams"`

	// Static configuration that was supplied using `SloMapping.StaticElasticityStrategyConfig`.
	// This must be optional.
	// Since we have no generics in Go (yet), this field needs to be added to the conrete ElasticityStrategySpec type.
	// +optional
	// StaticConfig sloCrds.ArbitraryConfigObject `json:"staticConfig,omitempty"`
}
