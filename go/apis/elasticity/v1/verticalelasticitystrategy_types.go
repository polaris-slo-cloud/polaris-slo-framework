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

// VerticalElasticityStrategySpec defines the desired state of VerticalElasticityStrategy
type VerticalElasticityStrategySpec struct {
	ElasticityStrategySpecBase `json:",inline"`

	// Specifies how much the current state of the system complies with the SLO.
	SloOutputParams SloCompliance `json:"sloOutputParams"`

	// Optional static configuration parameters for a VerticalElasticityStrategy
	//
	// +optional
	StaticConfig *VerticalElasticityStrategyStaticConfig `json:"staticConfig,omitempty"`
}

// Static configuration parameters for a VerticalElasticityStrategy
type VerticalElasticityStrategyStaticConfig struct {

	// The minimum resources allowed for a single workload instance.
	MinResources ContainerResources `json:"minResources"`

	// The maximum resources allowed for a single workload instance.
	MaxResources ContainerResources `json:"maxResources"`
}

// VerticalElasticityStrategyStatus defines the observed state of VerticalElasticityStrategy
type VerticalElasticityStrategyStatus struct {
}

// +kubebuilder:object:root=true

// VerticalElasticityStrategy is the Schema for the verticalelasticitystrategies API
type VerticalElasticityStrategy struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   VerticalElasticityStrategySpec   `json:"spec,omitempty"`
	Status VerticalElasticityStrategyStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// VerticalElasticityStrategyList contains a list of VerticalElasticityStrategy
type VerticalElasticityStrategyList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []VerticalElasticityStrategy `json:"items"`
}

func init() {
	SchemeBuilder.Register(&VerticalElasticityStrategy{}, &VerticalElasticityStrategyList{})
}
