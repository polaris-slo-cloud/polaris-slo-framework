package v1

// +kubebuilder:validation:Required

// SloMapping can be used as a base type for specific SLO mapping types by embedding it inline.
// It includes the properties required by most SLO mappings.
type SloMapping struct {
	// Specifies the target on which to execute the elasticity strategy.
	SloTarget `json:",inline"`

	// Specifies the type of ElasticityStrategy to use for this SLO mapping.
	// The strategy spec must have an SloCompliance embedded inline.
	ElasticityStrategy ElasticityStrategyKind `json:"elasticityStrategy"`
}
