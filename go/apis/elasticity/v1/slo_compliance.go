package v1

import (
	sloCrds "polaris-slo-cloud.github.io/polaris/apis/slo/v1"
)

const (
	// SloComplianceDefaultTolerance is the default tolerance for SloCompliance.
	SloComplianceDefaultTolerance int32 = 10

	// SloComplianceDefaultSloTargetCompliance is the default value for SloCompliance.SloTargetCompliance
	SloComplianceDefaultSloTargetCompliance int32 = 100
)

// SloCompliance contains the information needed for elasticity strategies that require only a single
// parameter, i.e., the current SLO compliance value.
//
// Embed this struct in the CRDs that should work with single parameter elasticity strategies.
type SloCompliance struct {
	// Specifies how much the current state of the system complies with the SLO.
	//
	// This value must be specified as an integer, e.g., `50` meaning 50%,
	// `100` meaning 100%, `200` meaning 200%.
	//
	// If this value is `100`, the SLO is met exactly and no scaling action is required.
	//
	// If this value is greater than `100`, the SLO is violated
	// and scaling out/up is required.
	//
	// If this value is less than `100`, the system is performing
	// better than the SLO demands and scaling in/down will be performed.
	//
	CurrSloCompliancePercentage int32 `json:"currSloCompliancePercentage,omitempty"`

	// Specifies the tolerance around 100%, within which no scaling will be performed.
	//
	// For example, if tolerance is `10`, no scaling will be performed as long as `currSloCompliancePercentage`
	// is between `90` and `110`.
	Tolerance *int32 `json:"tolerance,omitempty"`
}

// SloComplianceElasticityStrategyData describes the input data for any SloCompliance-based elasticity strategy.
type SloComplianceElasticityStrategyData struct {

	// Specifies the target on which to execute the elasticity strategy.
	sloCrds.SloTarget `json:",inline"`

	// Specifies how much the current state of the system complies with the SLO.
	SloCompliance `json:",inline"`
}
