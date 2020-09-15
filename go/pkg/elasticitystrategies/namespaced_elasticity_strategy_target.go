package elasticitystrategies

import (
	"fmt"

	"k8s.io/apimachinery/pkg/runtime/schema"
	crds "sloc.github.io/sloc/apis/elasticitystrategies/v1"
)

// NamespacedElasticityStrategyTarget is an ElasticityStrategyTarget with an additional property for storing the namespace.
type NamespacedElasticityStrategyTarget struct {
	Namespace string
	crds.ElasticityStrategyTarget
}

// ExtractGroupResource extracts a GroupResource from this target.
func (me *NamespacedElasticityStrategyTarget) ExtractGroupResource() (*schema.GroupResource, error) {
	targetGroupVersion, err := schema.ParseGroupVersion(me.TargetRef.APIVersion)
	if err != nil {
		return nil, fmt.Errorf("Could not determine GroupVersion from APIVersion: %v", err)
	}

	targetGroupRes := schema.GroupResource{
		Group:    targetGroupVersion.Group,
		Resource: me.TargetRef.Kind,
	}
	return &targetGroupRes, nil
}
