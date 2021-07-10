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
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// Important: Run `make` and `make manifests` to regenerate code and YAML files after modifying this file.

// HorizontalElasticityStrategySpec defines the desired state of HorizontalElasticityStrategy
type HorizontalElasticityStrategySpec struct {
	ElasticityStrategySpecBase `json:",inline"`

	// Specifies how much the current state of the system complies with the SLO.
	SloOutputParams SloCompliance `json:"sloOutputParams"`

	// Optional static configuration parameters for a HorizontalElasticityStrategy
	//
	// +optional
	StaticConfig *HorizontalElasticityStrategyStaticConfig `json:"staticConfig,omitempty"`
}

// Optional static configuration parameters for a HorizontalElasticityStrategy
type HorizontalElasticityStrategyStaticConfig struct {

	// The minium number of replicas that the target workload must have.
	//
	// Default: 1
	//
	// +optional
	// +kubebuilder:default=1
	// +kubebuilder:validation:Minimum=0
	MinReplicas *int32 `json:"minReplicas,omitempty"`

	// The maximum number of replicas that the target workload may have.
	//
	// Default: unlimited
	//
	// +optional
	// +kubebuilder:validation:Minimum=1
	MaxReplicas *int32 `json:"maxReplicas,omitempty"`
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
