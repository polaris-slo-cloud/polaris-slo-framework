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

type CostEfficiencyParams struct {

	// The target threshold for the `performance` metric.
	//
	// Depending on the specific metric implementation, the threshold may be considered as
	// a lower bound (`performance` samples should be above the threshold) or as an
	// upper bound (`performance` samples should be below the threshold).
	TargetThreshold int64 `json:"targetThreshold"`
}

// CostEfficiencyMetricMappingSpec defines the desired state of CostEfficiencyMetricMapping
type CostEfficiencyMetricMappingSpec struct {
	ComposedMetricMappingSpecBase `json:",inline"`

	// The cost efficiency configuration.
	MetricConfig CostEfficiencyParams `json:"metricConfig"`
}

// CostEfficiencyMetricMappingStatus defines the observed state of CostEfficiencyMetricMapping
type CostEfficiencyMetricMappingStatus struct{}

// +kubebuilder:object:root=true

// CostEfficiencyMetricMapping is the Schema for the costefficiencymetricmappings API
type CostEfficiencyMetricMapping struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   CostEfficiencyMetricMappingSpec   `json:"spec,omitempty"`
	Status CostEfficiencyMetricMappingStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// CostEfficiencyMetricMappingList contains a list of CostEfficiencyMetricMapping
type CostEfficiencyMetricMappingList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CostEfficiencyMetricMapping `json:"items"`
}

func init() {
	SchemeBuilder.Register(&CostEfficiencyMetricMapping{}, &CostEfficiencyMetricMappingList{})
}
