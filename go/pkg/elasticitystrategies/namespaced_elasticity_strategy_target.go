package elasticitystrategies

import (
	"fmt"

	"k8s.io/apimachinery/pkg/runtime/schema"
	crds "sloc.github.io/sloc/apis/slo/v1"
)

// NamespacedSloTarget is an ElasticityStrategyTarget with an additional property for storing the namespace.
type NamespacedSloTarget struct {
	Namespace string
	crds.SloTarget
}

// ExtractGroupResource extracts a GroupResource from this target.
func (me *NamespacedSloTarget) ExtractGroupResource() (*schema.GroupResource, error) {
	targetGroupVersion, err := schema.ParseGroupVersion(me.APIVersion)
	if err != nil {
		return nil, fmt.Errorf("Could not determine GroupVersion from APIVersion: %v", err)
	}

	targetGroupRes := schema.GroupResource{
		Group:    targetGroupVersion.Group,
		Resource: me.Kind,
	}
	return &targetGroupRes, nil
}
