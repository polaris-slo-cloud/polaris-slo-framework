package elasticitystrategies

import (
	crds "sloc.github.io/sloc/apis/elasticitystrategies/v1"
)

// SloComplianceElasticityStrategy is implemented by all elasticity services that require only SloCompliance values to be enforced.
type SloComplianceElasticityStrategy interface {

	// Enforce executes the elasticity strategy on the target, based on the current SLO compliance.
	Enforce(target *NamespacedElasticityStrategyTarget, sloCompliance *crds.SloCompliance) error
}
