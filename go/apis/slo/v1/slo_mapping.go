package v1

// +kubebuilder:validation:Required

// SloMapping can be used as a base type for specific SLO mapping types by embedding it inline.
// It includes the properties required by most SLO mappings.
type SloMapping struct {
	// Specifies the target on which to execute the elasticity strategy.
	TargetRef SloTarget `json:"targetRef"`

	// Specifies the type of ElasticityStrategy to use for this SLO mapping.
	ElasticityStrategy ElasticityStrategyKind `json:"elasticityStrategy"`

	// Any static configuration parameters, which are unknown to the SLO, but which may be required to configure
	// the chosen kind of elasticity strategy should be specified here. They will be copied over
	// into the spec of the elasticity strategy.
	StaticElasticityStrategyConfig interface{} `json:staticElasticityStrategyConfig,omitempty`
}
