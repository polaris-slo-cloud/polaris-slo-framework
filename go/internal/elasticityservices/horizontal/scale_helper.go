package horizontal

import (
	"context"

	"github.com/go-logr/logr"
	autoscaling "k8s.io/api/autoscaling/v1"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	scaleClient "k8s.io/client-go/scale"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	crds "sloc.github.io/sloc/apis/elasticitystrategies/v1"
)

// scaleHelper is used for obtaining and updating the Scale subresource of a target.
type scaleHelper struct {
	ctx         context.Context
	client      client.Client
	log         logr.Logger
	scaleClient scaleClient.ScalesGetter
}

// NewHorizontalElasticityService creates a new HorizontalElasticityService instance.
func newScaleHelper(ctx context.Context, client client.Client, log logr.Logger, mgr ctrl.Manager) *scaleHelper {
	// Unfortunately the controller-runtime client does not support the Scale subresource, so we need to use client-go directly
	// https://github.com/kubernetes-sigs/controller-runtime/issues/172
	clientSet := kubernetes.NewForConfigOrDie(mgr.GetConfig())
	scaleKindResolver := scaleClient.NewDiscoveryScaleKindResolver(clientSet.Discovery())
	scalesGetter := scaleClient.New(clientSet.RESTClient(), mgr.GetRESTMapper(), dynamic.LegacyAPIPathResolverFunc, scaleKindResolver)

	return &scaleHelper{
		ctx:         ctx,
		client:      client,
		log:         log,
		scaleClient: scalesGetter,
	}
}

func (me *scaleHelper) fetchScale(target *crds.ElasticityStrategyTarget) (*autoscaling.Scale, error) {

}
