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

package controllers

import (
	"context"

	"github.com/go-logr/logr"
	autoscaling "k8s.io/api/autoscaling/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"

	elasticityStrategies "sloc.github.io/sloc/apis/elasticitystrategies/v1"
	"sloc.github.io/sloc/internal/util"
)

// TemplateStrategyReconciler reconciles a TemplateStrategy object
type TemplateStrategyReconciler struct {
	client.Client
	Log    logr.Logger
	Scheme *runtime.Scheme
}

// +kubebuilder:rbac:groups=elasticitystrategies.sloc.github.io,resources=templatestrategies,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=elasticitystrategies.sloc.github.io,resources=templatestrategies/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=autoscaling,resources=hpa,verbs=get;list;watch;create;update;patch;delete

// Reconcile is called by the manager, whenever its underlying informers report that an
// object has been added, updated, or deleted.
func (r *TemplateStrategyReconciler) Reconcile(req ctrl.Request) (ctrl.Result, error) {
	ctx := context.Background()
	log := r.Log.WithValues("templateStrategy", req.NamespacedName)

	// Fetch the TemplateStrategy that we need to reconcile
	var templateStrategy elasticityStrategies.TemplateStrategy
	if err := r.Get(ctx, req.NamespacedName, &templateStrategy); err != nil {
		log.Error(err, "Unable to fetch TemplateStrategy")
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}
	log.Info("Successfully fetched TemplateStrategy")

	// Fetch the HPAs associated with this strategy.
	var hpas autoscaling.HorizontalPodAutoscalerList
	if err := r.List(ctx, &hpas, client.InNamespace(req.Namespace), client.MatchingFields{util.KubeObjectOwnerKey: req.Name}); err != nil {
		log.Error(err, "Unable to list associated HPAs")
		return ctrl.Result{}, err
	}

	// TODO: Fetch the VPAs associated with this strategy.

	return ctrl.Result{}, nil
}

// SetupWithManager sets up the TemplateStrategyReconciler.
func (r *TemplateStrategyReconciler) SetupWithManager(mgr ctrl.Manager) error {
	ctx := context.Background()
	extractOwnerName := util.CreateOwnerNameExtractor(elasticityStrategies.GroupVersion, "TemplateStrategy")

	// Create an index for HPAs
	if err := mgr.GetFieldIndexer().IndexField(ctx, &autoscaling.HorizontalPodAutoscaler{}, util.KubeObjectOwnerKey, extractOwnerName); err != nil {
		return err
	}

	return ctrl.NewControllerManagedBy(mgr).
		For(&elasticityStrategies.TemplateStrategy{}).
		// Owns() makes sure that a change in an HPA will also trigger a Reconcile() call.
		Owns(&autoscaling.HorizontalPodAutoscaler{}).
		Complete(r)
}
