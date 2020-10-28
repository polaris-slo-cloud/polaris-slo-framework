package v1

// ArbitraryConfigObject can be used for defining a field in a CRD
// that should be able to hold an arbitrary object.
// Note that deepCopy() will only be able to create shallow copies of such an object,
// because it does not know its internal structure.
type ArbitraryConfigObject struct{}
