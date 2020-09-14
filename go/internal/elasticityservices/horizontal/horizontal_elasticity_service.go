package horizontal

import (
	"context"

	"github.com/go-logr/logr"
	"sigs.k8s.io/controller-runtime/pkg/client"
	crds "sloc.github.io/sloc/apis/elasticitystrategies/v1"
)

// HorizontalElasticityService performs horizontal scaling operations based on a HorizontalElasticityStrategy.
// This type implements the SloComplianceElasticityStrategy interface.
type HorizontalElasticityService struct {
	ctx    context.Context
	client client.Client
	log    logr.Logger
}

// NewHorizontalElasticityService creates a new HorizontalElasticityService instance.
func NewHorizontalElasticityService(ctx context.Context, client client.Client, log logr.Logger) *HorizontalElasticityService {
	return &HorizontalElasticityService{
		ctx:    ctx,
		client: client,
		log:    log,
	}
}

// Enforce performs horizontal scaling on target if necessary, based on the current SLO compliance.
func (me *HorizontalElasticityService) Enforce(target *crds.ElasticityStrategyTarget, sloCompliance *crds.SloCompliance) error {
	return nil
}
