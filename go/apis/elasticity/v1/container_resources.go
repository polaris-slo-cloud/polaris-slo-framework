package v1

// ContainerResources describes the resources used/required by a container or set of containers.
type ContainerResources struct {

	// The memory in MiB.
	//
	// +kubebuilder:validation:Minimum=1
	MemoryMiB int64 `json:"memoryMiB"`

	// The CPU cores in milli CPU (1000 milli CPU = 1 CPU core).
	//
	// +kubebuilder:validation:Minimum=1
	MilliCpu int32 `json:"milliCpu"`
}
