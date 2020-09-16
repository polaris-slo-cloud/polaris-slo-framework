package horizontal

import (
	"context"

	"github.com/go-logr/logr"
	autoscaling "k8s.io/api/autoscaling/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	scaleClient "k8s.io/client-go/scale"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	eStrategies "sloc.github.io/sloc/pkg/elasticitystrategies"
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

// Gets the Scale subresource for the specified target.
func (me *scaleHelper) getScale(target *eStrategies.NamespacedElasticityStrategyTarget) (*autoscaling.Scale, error) {
	targetGroupRes, err := target.ExtractGroupResource()
	if err != nil {
		return nil, err
	}

	return me.scaleClient.Scales(target.Namespace).Get(me.ctx, *targetGroupRes, target.TargetRef.Name, metav1.GetOptions{})
}

// Updates the Scale subresource on the specified target.
func (me *scaleHelper) updateScale(target *eStrategies.NamespacedElasticityStrategyTarget, scale *autoscaling.Scale) (*autoscaling.Scale, error) {
	targetGroupRes, err := target.ExtractGroupResource()
	if err != nil {
		return nil, err
	}

	return me.scaleClient.Scales(target.Namespace).Update(me.ctx, *targetGroupRes, scale, metav1.UpdateOptions{})
}
