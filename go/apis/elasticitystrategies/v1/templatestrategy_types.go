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

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// TemplateStrategySpec defines the desired state of TemplateStrategy
type TemplateStrategySpec struct {
	// INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
	// Important: Run "make" to regenerate code after modifying this file

	// Foo is an example field of TemplateStrategy. Edit TemplateStrategy_types.go to remove/update
	Foo string `json:"foo,omitempty"`
}

// TemplateStrategyStatus defines the observed state of TemplateStrategy
type TemplateStrategyStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
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
