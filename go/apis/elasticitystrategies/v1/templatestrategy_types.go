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

// +kubebuilder:validation:Required

package v1

import (
	autoscaling "k8s.io/api/autoscaling/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// Important: Run `make` and `make manifests` to regenerate code and YAML files after modifying this file.

// TemplateStrategySpec defines the desired state of TemplateStrategy
type TemplateStrategySpec struct {
	// Specifies the target on which to perform the scaling.
	TargetRef autoscaling.CrossVersionObjectReference `json:"targetRef"`

	// The horizontal scaling options in this strategy.
	// If this is omitted, no horizontal scaling will be performed.
	// +optional
	HorizontalSpec *HorizontalScalingSpec `json:"horizontalSpec,omitempty"`

	// The vertical scaling options in this strategy.
	// If this is omitted, no vertical scaling will be performed.
	// +optional
	VerticalSpec *VerticalScalingSpec `json:"verticalSpec,omitempty"`
}

// TemplateStrategyStatus defines the observed state of TemplateStrategy
type TemplateStrategyStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
}

// HorizontalScalingSpec describes the horizontal scaling options in the TemplateStrategy.
type HorizontalScalingSpec struct {

	// The maximum number of replicas that should be allowed when scaling out.
	// +kubebuilder:validation:Minimum=1
	// +optional
	MaxReplicas *int32 `json:"maxReplicas,omitempty"`

	// The target average CPU utilization percentage of the pods (percentage of the allocated CPUs).
	// +kubebuilder:validation:Minimum=1
	// +kubebuilder:validation:Maximum=100
	TargetAvgCPUUtilizationPercentage int32 `json:"targetAvgCPUUtilizationPercentage"`
}

// VerticalScalingSpec describes the vertical scaling options in the TemplateStrategy.
type VerticalScalingSpec struct {
	// The minimum percentage of its requested memory that a pod must use.
	// If the usage drops below this threshold, the pod will be scaled down.
	// +kubebuilder:validation:Minimum=1
	// +kubebuilder:validation:Maximum=100
	MinMemoryPercentage int32 `json:"minMemoryPercentage,omitempty"`

	// The maximum percentage of its requested memory that a pod can use before being scaled up.
	// +kubebuilder:validation:Minimum=1
	// +kubebuilder:validation:Maximum=100
	MaxMemoryPercentage int32 `json:"maxMemoryPercentage,omitempty"`

	// // The minimum CPU resources that a container may be scaled down to.
	// // +optional
	// MinCPU *resource.Quantity `json:"minCPU,omitempty"`

	// // The minimum CPU resources that a container may be scaled up to.
	// // +kubebuilder:default=4
	// MaxCPU resource.Quantity `json:"maxCPU"`
}

// +kubebuilder:object:root=true

// TemplateStrategy is the Schema for the templatestrategies API
type TemplateStrategy struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   TemplateStrategySpec   `json:"spec,omitempty"`
	Status TemplateStrategyStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// TemplateStrategyList contains a list of TemplateStrategy
type TemplateStrategyList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []TemplateStrategy `json:"items"`
}

func init() {
	SchemeBuilder.Register(&TemplateStrategy{}, &TemplateStrategyList{})
}
