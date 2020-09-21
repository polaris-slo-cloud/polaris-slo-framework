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

// CPUUsageSloApplicationSpec is used to apply a CPUUsageSLO to a target workload.
type CPUUsageSloApplicationSpec struct {
	// Specifies the target on which to execute the elasticity strategy.
	SloTarget `json:",inline"`

	// The target average CPU utilization percentage of the workload's pods (percentage of the allocated CPUs).
	// +kubebuilder:validation:Minimum=1
	// +kubebuilder:validation:Maximum=100
	TargetAvgCPUUtilizationPercentage int32 `json:"targetAvgCPUUtilizationPercentage"`
}

// CPUUsageSloApplicationStatus defines the observed state of CPUUsageSloApplication
type CPUUsageSloApplicationStatus struct {
}

// +kubebuilder:object:root=true

// CPUUsageSloApplication is the Schema for the cpuusagesloapplications API
type CPUUsageSloApplication struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   CPUUsageSloApplicationSpec   `json:"spec,omitempty"`
	Status CPUUsageSloApplicationStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// CPUUsageSloApplicationList contains a list of CPUUsageSloApplication
type CPUUsageSloApplicationList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CPUUsageSloApplication `json:"items"`
}

func init() {
	SchemeBuilder.Register(&CPUUsageSloApplication{}, &CPUUsageSloApplicationList{})
}
