package v1

import (
	autoscaling "k8s.io/api/autoscaling/v1"
)

// ElasticityStrategyTarget specifies the target entity for an elasticity strategy and SLO.
type ElasticityStrategyTarget struct {
	// Specifies the target on which to execute the elasticity strategy.
	TargetRef autoscaling.CrossVersionObjectReference `json:"targetRef"`
}
