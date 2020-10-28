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

package util

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

// KubeObjectOwnerKey is the key that is used to store the owner of an object in Kubernetes.
const KubeObjectOwnerKey = ".metadata.controller"

// CreateOwnerNameExtractor returns a `client.IndexerFunc` that can be used to extract the owner of a `runtime.Object`
// for use with a `client.FieldIndexer`.
func CreateOwnerNameExtractor(ownerAPIVersion schema.GroupVersion, ownerKind string) client.IndexerFunc {
	return func(rawObj runtime.Object) []string {
		// Assert that the underlying type of the interface value of rawObj also implements the metav1.Object interface
		obj := rawObj.(metav1.Object)
		owner := metav1.GetControllerOf(obj)
		if owner == nil {
			return nil
		}

		// Check if the owner is of the correct kind and version
		if owner.APIVersion != ownerAPIVersion.String() || owner.Kind != ownerKind {
			return nil
		}

		return []string{owner.Name}
	}
}
