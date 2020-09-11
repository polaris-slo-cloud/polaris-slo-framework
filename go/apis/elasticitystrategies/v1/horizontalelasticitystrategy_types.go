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
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// Important: Run `make` and `make manifests` to regenerate code and YAML files after modifying this file.

// HorizontalElasticityStrategySpec defines the desired state of HorizontalElasticityStrategy
type HorizontalElasticityStrategySpec struct {
	// Specifies the target on which to perform the scaling.
	TargetRef autoscaling.CrossVersionObjectReference `json:"targetRef"`

	// Specifies how much the current state of the system complies with the SLO.
	//
	// * If this value is the same as SloTargetValue, the SLO is met exactly.
	//
	// * If this value is greater greater than SloTargetValue, the SLO is violated
	// and scaling out is required.
	//
	// * If this value is less than SloTargetValue, the system is performing
	// better than the SLO demands and scaling in will be performed.
	CurrSloCompliance *resource.Quantity `json:"currSloCompliance"`

	// Specifies the value at which the SLO is exactly met.
	// Default: 1.0
	// +optional
	SloTargetValue *resource.Quantity `json:"sloTargetValue,omitempty"`
}

// HorizontalElasticityStrategyStatus defines the observed state of HorizontalElasticityStrategy
type HorizontalElasticityStrategyStatus struct {
}

// +kubebuilder:object:root=true

// HorizontalElasticityStrategy is the Schema for the horizontalelasticitystrategies API
type HorizontalElasticityStrategy struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   HorizontalElasticityStrategySpec   `json:"spec,omitempty"`
	Status HorizontalElasticityStrategyStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// HorizontalElasticityStrategyList contains a list of HorizontalElasticityStrategy
type HorizontalElasticityStrategyList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []HorizontalElasticityStrategy `json:"items"`
}

func init() {
	SchemeBuilder.Register(&HorizontalElasticityStrategy{}, &HorizontalElasticityStrategyList{})
}
