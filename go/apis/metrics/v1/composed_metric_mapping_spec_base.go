package v1

import (
	sloCrds "polaris-slo-cloud.github.io/polaris/apis/slo/v1"
)

// ComposedMetricMappingBase is the base for all composed metric mapping CRDs and should be included
// inline in any ComposedMetricMappingSpec type.
//
// Additionally, a `metricConfig` JSON field must be added to all composed metric mapping CRDs.
type ComposedMetricMappingSpecBase struct {

	// Specifies the target for which the metric should be computed.
	TargetRef sloCrds.SloTarget `json:"targetRef"`
}
