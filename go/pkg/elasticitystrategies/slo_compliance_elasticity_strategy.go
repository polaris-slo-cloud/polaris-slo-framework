package elasticitystrategies

import (
	crds "polaris-slo-cloud.github.io/polaris/apis/elasticity/v1"
)

// SloComplianceElasticityStrategy is implemented by all elasticity services that require only SloCompliance values to be enforced.
type SloComplianceElasticityStrategy interface {

	// Enforce executes the elasticity strategy on the target, based on the current SLO compliance.
	Enforce(target *NamespacedSloTarget, sloCompliance *crds.SloCompliance) error
}
