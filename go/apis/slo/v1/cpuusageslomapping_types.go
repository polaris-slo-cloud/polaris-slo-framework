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

// CPUUsageSloMappingSpec is used to apply a CPUUsageSLO to a target workload.
type CPUUsageSloMappingSpec struct {
	SloMapping SloMapping `json:",inline"`

	// The target average CPU utilization percentage of the workload's pods (percentage of the allocated CPUs).
	// +kubebuilder:validation:Minimum=1
	// +kubebuilder:validation:Maximum=100
	TargetAvgCPUUtilizationPercentage int32 `json:"targetAvgCPUUtilizationPercentage"`
}

// CPUUsageSloMappingStatus defines the observed state of CPUUsageSloMapping
type CPUUsageSloMappingStatus struct {
}

// +kubebuilder:object:root=true

// CPUUsageSloMapping is the Schema for the cpuusageslomappings API
type CPUUsageSloMapping struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   CPUUsageSloMappingSpec   `json:"spec,omitempty"`
	Status CPUUsageSloMappingStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// CPUUsageSloMappingList contains a list of CPUUsageSloMapping
type CPUUsageSloMappingList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CPUUsageSloMapping `json:"items"`
}

func init() {
	SchemeBuilder.Register(&CPUUsageSloMapping{}, &CPUUsageSloMappingList{})
}
