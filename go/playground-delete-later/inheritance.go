package main

import (
	"fmt"
)

type Animal interface {
	Type() string
	Move()
}

type Mammal interface {
	Animal
}

// AnimalBase Type (inofficially abstract)
type AnimalBase struct {
	animalType string
}

func newAnimalBase(animalType string) *AnimalBase {
	return &AnimalBase{animalType: animalType}
}

func (this *AnimalBase) Type() string {
	return this.animalType
}

// MammalBase Type (inofficially abstract)
type MammalBase struct {
	*AnimalBase
}

func newMammalBase(animalType string) *MammalBase {
	return &MammalBase{AnimalBase: newAnimalBase(animalType)}
}

func (this *MammalBase) Move() {
	fmt.Printf("MammalBase: %s is moving\n", this.Type())
}

// Dog Type
type Dog struct {
	*MammalBase
	breed string
}

func NewDog(breed string) *Dog {
	return &Dog{
		MammalBase: newMammalBase("dog"),
		breed:      breed,
	}
}

// Go's way of overriding a method and using the super type's method
func (this *Dog) Type() string {
	return this.breed + " " + this.MammalBase.Type()
}

// ElephantOrigin is basically an enumeration
type ElephantOrigin string

const (
	AFRICA = "Africa"
	INDIA  = "India"
)

// Integer variant
// type ElephantOrigin int
// const (
// 	AFRICA = iota
// 	INDIA
// )

// Elephant Type
type Elephant struct {
	*MammalBase
	origin ElephantOrigin
}

func NewElephant(origin ElephantOrigin) *Elephant {
	return &Elephant{
		MammalBase: newMammalBase("elephant"),
		origin:     origin,
	}
}

func (this *Elephant) Move() {
	fmt.Printf("Elephant from %s is moving\n", this.origin)
}

func main() {
	jerryLee := NewDog("German Shepherd")
	fmt.Println(jerryLee.Type())
	jerryLee.Move()

	var animal Animal = jerryLee
	fmt.Println(animal.Type())
	animal.Move()

	// Go allows explicit access to the super type, because the sub type does not inherit from
	// the super type, but rather just has a member with that name.
	fmt.Println(jerryLee.AnimalBase.Type())

	// This is not possible in Go, because there is not actual inheritance.
	//var animalBase *AnimalBase = jerryLee

	// This would be possible, but then we would lose everything added by the Dog type, because there is no real inheritance.
	// var animalBase *AnimalBase = jerryLee.AnimalBase

	benjamin := NewElephant(AFRICA)
	fmt.Println(benjamin.Type())
	benjamin.Move()

	var mammal Mammal = benjamin
	fmt.Println(mammal.Type())
	mammal.Move()

	benjamin.MammalBase.Move()
}
