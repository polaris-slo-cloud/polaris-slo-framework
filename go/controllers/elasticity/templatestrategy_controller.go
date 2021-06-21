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
	"fmt"

	"github.com/go-logr/logr"
	autoscaling "k8s.io/api/autoscaling/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"

	elasticityStrategies "polaris-slo-cloud.github.io/polaris/apis/elasticity/v1"
	"polaris-slo-cloud.github.io/polaris/internal/util"
)

// TemplateStrategyReconciler reconciles a TemplateStrategy object
type TemplateStrategyReconciler struct {
	client.Client
	Log    logr.Logger
	Scheme *runtime.Scheme
}

// +kubebuilder:rbac:groups=elasticity.polaris-slo-cloud.github.io,resources=templatestrategies,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=elasticity.polaris-slo-cloud.github.io,resources=templatestrategies/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=autoscaling,resources=horizontalpodautoscalers,verbs=get;list;watch;create;update;patch;delete

// Reconcile is called by the manager, whenever its underlying informers report that an
// object has been added, updated, or deleted.
func (r *TemplateStrategyReconciler) Reconcile(req ctrl.Request) (ctrl.Result, error) {
	ctx := context.Background()
	log := r.Log.WithValues("templateStrategy", req.NamespacedName)
	log.Info("Reconcile() called")

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

	// If there is an existing HPA, update it, otherwise create a new one.
	if len(hpas.Items) > 0 {
		if err := r.updateHPA(ctx, &hpas.Items[0], &templateStrategy); err != nil {
			log.Error(err, "Unable to update existing HPA object")
			return ctrl.Result{}, err
		}
		log.Info("Successfully updated HPA")
	} else {
		if err := r.createHPA(ctx, &templateStrategy); err != nil {
			log.Error(err, "Unable to create new HPA object")
			return ctrl.Result{}, err
		}
		log.Info("Successfully created new HPA")
	}

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

func (r *TemplateStrategyReconciler) constructNewHPA(templateStrategy *elasticityStrategies.TemplateStrategy) (*autoscaling.HorizontalPodAutoscaler, error) {
	hpaName := fmt.Sprintf("hpa-%s", templateStrategy.Name)

	hpa := autoscaling.HorizontalPodAutoscaler{
		ObjectMeta: metav1.ObjectMeta{
			Labels:      make(map[string]string),
			Annotations: make(map[string]string),
			Name:        hpaName,
			Namespace:   templateStrategy.Namespace,
		},
	}
	configureHPA(&hpa, templateStrategy)

	if err := ctrl.SetControllerReference(templateStrategy, &hpa, r.Scheme); err != nil {
		return nil, err
	}

	return &hpa, nil
}

func configureHPA(hpa *autoscaling.HorizontalPodAutoscaler, templateStrategy *elasticityStrategies.TemplateStrategy) {
	hpa.Spec.ScaleTargetRef = templateStrategy.Spec.TargetRef
	hpa.Spec.TargetCPUUtilizationPercentage = &templateStrategy.Spec.HorizontalSpec.TargetAvgCPUUtilizationPercentage
	if templateStrategy.Spec.HorizontalSpec.MaxReplicas != nil {
		hpa.Spec.MaxReplicas = *templateStrategy.Spec.HorizontalSpec.MaxReplicas
	} else {
		hpa.Spec.MaxReplicas = 10
	}
}

func (r *TemplateStrategyReconciler) updateHPA(ctx context.Context, hpa *autoscaling.HorizontalPodAutoscaler, templateStrategy *elasticityStrategies.TemplateStrategy) error {
	configureHPA(hpa, templateStrategy)
	return r.Client.Update(ctx, hpa)
}

func (r *TemplateStrategyReconciler) createHPA(ctx context.Context, templateStrategy *elasticityStrategies.TemplateStrategy) error {
	hpa, err := r.constructNewHPA(templateStrategy)
	if err != nil {
		return err
	}

	// Create the HPA in the cluster
	return r.Create(ctx, hpa)
}
