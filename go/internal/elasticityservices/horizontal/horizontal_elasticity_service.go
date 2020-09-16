package horizontal

import (
	"context"
	"fmt"
	"math"

	"github.com/go-logr/logr"
	autoscaling "k8s.io/api/autoscaling/v1"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	crds "sloc.github.io/sloc/apis/elasticitystrategies/v1"
	"sloc.github.io/sloc/internal/util"
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
func (me *HorizontalElasticityService) Enforce(target *eStrategies.NamespacedElasticityStrategyTarget, sloState *crds.SloCompliance) error {
	log := me.log.WithValues("target", fmt.Sprintf("%s/%s", target.TargetRef.Kind, target.TargetRef.Name))

	if me.isSloFulfilled(sloState) {
		log.Info("SLO is currently fulfilled")
		return nil
	}

	currScale, err := me.scaleHelper.getScale(target)
	if err != nil {
		log.Error(err, "Unable to get the scale for the target.")
		return err
	}

	desiredReplicas := me.calculateDesiredReplicas(sloState, currScale)
	if desiredReplicas == currScale.Spec.Replicas {
		log.Info("No change in the number of replicas.")
		return nil
	}

	newScale := currScale.DeepCopy()
	newScale.Spec.Replicas = desiredReplicas
	_, err = me.scaleHelper.updateScale(target, newScale)
	if err != nil {
		log.Error(err, "Error updating scale.", "oldReplicas", currScale.Spec.Replicas, "newReplicas", newScale.Spec.Replicas)
		return err
	}
	log.Info("Successfully updated scale.", "oldReplicas", currScale.Spec.Replicas, "newReplicas", newScale.Spec.Replicas)
	return nil
}

// Returns true if the SLO is currently fulfilled, otherwise false.
func (me *HorizontalElasticityService) isSloFulfilled(sloState *crds.SloCompliance) bool {
	currCompliance := util.ConvertQuantityToFloat(sloState.CurrSloCompliance)
	sloTargetCompliance := util.ConvertQuantityToFloatOrDefault(sloState.SloTargetCompliance, crds.SloComplianceDefaultSloTargetCompliance)
	sloTolerance := util.ConvertQuantityToFloatOrDefault(sloState.Tolerance, crds.SloComplianceDefaultTolerance)

	lowerBound := sloTargetCompliance - sloTolerance
	upperBound := sloTargetCompliance + sloTolerance
	return currCompliance >= lowerBound && currCompliance <= upperBound
}

// Calculates the number of desired replicas according to the same formula as HPA.
//
// See https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details
// desiredReplicas = ceil[currentReplicas * ( currSloCompliance / desiredSloCompliance )]
func (me *HorizontalElasticityService) calculateDesiredReplicas(sloState *crds.SloCompliance, currScale *autoscaling.Scale) int32 {
	currCompliance := util.ConvertQuantityToFloat(sloState.CurrSloCompliance)
	sloTargetCompliance := util.ConvertQuantityToFloatOrDefault(sloState.SloTargetCompliance, crds.SloComplianceDefaultSloTargetCompliance)

	scaleFactor := currCompliance / sloTargetCompliance
	desiredReplicas := float64(currScale.Spec.Replicas) * scaleFactor
	return int32(math.Ceil(desiredReplicas))
}
