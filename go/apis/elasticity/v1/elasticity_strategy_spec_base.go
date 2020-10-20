package v1

import (
	sloCrds "sloc.github.io/sloc/apis/slo/v1"
)

// ElasticityStrategySpecBase should be embedded inline in an ElasticityStrategySpec.
// In addition to the fields provided by this base type, an `SloOutputParams` field
// must be added to hold the output of the SLO.
type ElasticityStrategySpecBase struct {

	// Specifies the target on which to execute the elasticity strategy.
	TargetRef sloCrds.SloTarget `json:"targetRef"`

	// The output parameters resulting from the SLO execution.
	// Since we have no generics in Go (yet), this field needs to be added to the conrete ElasticityStrategySpec type.
	// SloOutputParams SloOutputType `json:"sloOutputParams"`

	// Static configuration that was supplied using `SloMapping.StaticElasticityStrategyConfig`.
	StaticConfig sloCrds.ArbitraryConfigObject `json:"staticConfig,omitempty"`
}
