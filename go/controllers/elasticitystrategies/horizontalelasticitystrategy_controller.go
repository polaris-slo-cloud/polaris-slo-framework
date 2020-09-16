/*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package elasticitystrategies

import (
	"context"

	"github.com/go-logr/logr"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"

	crds "sloc.github.io/sloc/apis/elasticitystrategies/v1"
	"sloc.github.io/sloc/internal/elasticityservices/horizontal"
	eStrategies "sloc.github.io/sloc/pkg/elasticitystrategies"
)

// HorizontalElasticityStrategyReconciler reconciles a HorizontalElasticityStrategy object
type HorizontalElasticityStrategyReconciler struct {
	client.Client
	Log    logr.Logger
	Scheme *runtime.Scheme

	horizontalService *horizontal.HorizontalElasticityService
}

// ToDo: We need to find a way to request access to all scale subresources.
// The strategy should be able to work with resource types, which are not known at compile time.

// +kubebuilder:rbac:groups=elasticitystrategies.sloc.github.io,resources=horizontalelasticitystrategies,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=elasticitystrategies.sloc.github.io,resources=horizontalelasticitystrategies/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=apps,resources=deployments,verbs=get;list;watch;update;patch;
// +kubebuilder:rbac:groups=apps,resources=deployments/scale,verbs=get;update;patch
// +kubebuilder:rbac:groups=apps,resources=replicasets,verbs=get;list;watch;update;patch;
// +kubebuilder:rbac:groups=apps,resources=replicasets/scale,verbs=get;update;patch

// Reconcile is triggered whenever a HorizontalElasticityStrategy is added or changed and performs any scaling operations
// that arise from a violation of the SLO.
//
// 1. The SLO creates/updates a HorizontalElasticityStrategy with the current level of SLO compliance
// 2. This controller gets the corresponding scaling suberesource and checks if the resource version of the last HorizontalElasticityStrategy
//    stored in the scaling resource matches the current resource version.
// 3. If the resource versions match, do nothing (an action has already been taken)
// 4. If the resource versions do not match, check if we need a scaling operation, based on the SLO values,
//    apply that scaling action, and update the resource version stored in the scaling resource.
//
// Note: Maybe we don't even need the resource version check, because Reconcile won't be called again until one of the resources changes.
func (me *HorizontalElasticityStrategyReconciler) Reconcile(req ctrl.Request) (ctrl.Result, error) {
	ctx := context.Background()
	log := me.Log.WithValues("HorizontalElasticityStrategy", req.NamespacedName)
	log.Info("Reconcile() called")

	var strategy crds.HorizontalElasticityStrategy
	if err := me.Get(ctx, req.NamespacedName, &strategy); err != nil {
		log.Error(err, "Unable to fetch HorizontalElasticityStrategy")
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	namespacedTarget := eStrategies.NamespacedElasticityStrategyTarget{
		Namespace:                req.Namespace,
		ElasticityStrategyTarget: strategy.Spec.ElasticityStrategyTarget,
	}
	if err := me.horizontalService.Enforce(&namespacedTarget, &strategy.Spec.SloCompliance); err != nil {
		log.Error(err, "Could not enforce HorizontalElasticityStrategy.")
		return ctrl.Result{}, err
	}

	return ctrl.Result{}, nil
}

// SetupWithManager sets up the HorizontalElasticityStrategyReconciler.
func (me *HorizontalElasticityStrategyReconciler) SetupWithManager(mgr ctrl.Manager) error {
	me.horizontalService = horizontal.NewHorizontalElasticityService(context.Background(), me.Client, me.Log, mgr)

	return ctrl.NewControllerManagedBy(mgr).
		For(&crds.HorizontalElasticityStrategy{}).
		Complete(me)
}
