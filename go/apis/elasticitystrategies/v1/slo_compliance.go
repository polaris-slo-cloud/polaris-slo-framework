package v1

import (
	"k8s.io/apimachinery/pkg/api/resource"
)

const (
	// SloComplianceDefaultTolerance is the default tolerance for SloCompliance.
	SloComplianceDefaultTolerance = 0.1

	// SloComplianceDefaultSloTargetCompliance is the default value for SloCompliance.SloTargetCompliance
	SloComplianceDefaultSloTargetCompliance = 1.0
)

// SloCompliance contains the information needed for elasticity strategies that require only a single
// parameter, i.e., the current SLO compliance value.
//
// Embed this struct in the CRDs that should work with single parameter elasticity strategies.
type SloCompliance struct {
	// Specifies how much the current state of the system complies with the SLO.
	//
	// * If this value is the same as SloTargetValue, the SLO is met exactly.
	//
	// * If this value is greater greater than SloTargetValue, the SLO is violated
	// and scaling out is required.
	//
	// * If this value is less than SloTargetValue, the system is performing
	// better than the SLO demands and scaling in will be performed.
	CurrSloCompliance *resource.Quantity `json:"currSloCompliance"`

	// Specifies the (decimal) value at which the SLO is exactly met.
	// Default: 1.0
	// +optional
	SloTargetCompliance *resource.Quantity `json:"sloTargetValue,omitempty"`

	// Specifies the (decimal) tolerance around SloTargetCompliance, within which no scaling will be performed.
	// Default: 0.1
	// +optional
	Tolerance *resource.Quantity `json:"tolerance,omitempty"`
}
