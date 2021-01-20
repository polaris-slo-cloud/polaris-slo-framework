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

package v1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// Important: Run `make` and `make manifests` to regenerate code and YAML files after modifying this file.

// CostEfficiencySloConfig contains the configuration for a CostEfficiencySloMappingSpec.
type CostEfficiencySloConfig struct {

	// The number of milliseconds, within which the requests should be handled.
	// +kubebuilder:validation:Minimum=0
	ResponseTimeThresholdMs int32 `json:"responseTimeThresholdMs"`

	// The desired cost efficiency.
	// +kubebuilder:validation:Minimum=0
	TargetCostEfficiency int32 `json:"targetCostEfficiency"`

	// The minimum percentile of requests that should be handled within the time threshold.
	MinRequestsPercentile *int32 `json:"minRequestsPercentile;omitempty"`
}

// CostEfficiencySloMappingSpec defines the desired state of CostEfficiencySloMapping
type CostEfficiencySloMappingSpec struct {
	SloMapping SloMapping `json:",inline"`

	SloConfig CostEfficiencySloConfig `json:"sloConfig"`
}

// CostEfficiencySloMappingStatus defines the observed state of CostEfficiencySloMapping
type CostEfficiencySloMappingStatus struct {
}

// +kubebuilder:object:root=true

// CostEfficiencySloMapping is the Schema for the costefficiencyslomappings API
type CostEfficiencySloMapping struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   CostEfficiencySloMappingSpec   `json:"spec,omitempty"`
	Status CostEfficiencySloMappingStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// CostEfficiencySloMappingList contains a list of CostEfficiencySloMapping
type CostEfficiencySloMappingList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CostEfficiencySloMapping `json:"items"`
}

func init() {
	SchemeBuilder.Register(&CostEfficiencySloMapping{}, &CostEfficiencySloMappingList{})
}
