package horizontal

import (
	"context"

	"github.com/go-logr/logr"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	crds "sloc.github.io/sloc/apis/elasticitystrategies/v1"
	eStrategies "sloc.github.io/sloc/pkg/elasticitystrategies"
)

// HorizontalElasticityService performs horizontal scaling operations based on a HorizontalElasticityStrategy.
// This type implements the SloComplianceElasticityStrategy interface.
type HorizontalElasticityService struct {
	ctx         context.Context
	client      client.Client
	log         logr.Logger
	scaleHelper *scaleHelper
}

// NewHorizontalElasticityService creates a new HorizontalElasticityService instance.
func NewHorizontalElasticityService(ctx context.Context, client client.Client, log logr.Logger, mgr ctrl.Manager) *HorizontalElasticityService {
	return &HorizontalElasticityService{
		ctx:         ctx,
		client:      client,
		log:         log,
		scaleHelper: newScaleHelper(ctx, client, log, mgr),
	}
}

// Enforce performs horizontal scaling on target if necessary, based on the current SLO compliance.
func (me *HorizontalElasticityService) Enforce(target *eStrategies.NamespacedElasticityStrategyTarget, sloCompliance *crds.SloCompliance) error {
	return nil
}
