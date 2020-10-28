package util

import (
	"math"

	"k8s.io/apimachinery/pkg/api/resource"
)

// ConvertQuantityToFloat converts a resource.Quantity into a floating point number.
func ConvertQuantityToFloat(q *resource.Quantity) float64 {
	dec := q.AsDec()
	unscaled := dec.UnscaledBig().Int64()
	scale := int(dec.Scale())

	// See the source code of inf.Dec for infos on the formula.
	multiplier := math.Pow10(scale)
	return float64(unscaled) * multiplier
}

// ConvertQuantityToFloatOrDefault converts a resource.Quantity into a floating point number or returns defaultValue if the quantiti is nil.
func ConvertQuantityToFloatOrDefault(q *resource.Quantity, defaultValue float64) float64 {
	if q != nil {
		return ConvertQuantityToFloat(q)
	} else {
		return defaultValue
	}
}
