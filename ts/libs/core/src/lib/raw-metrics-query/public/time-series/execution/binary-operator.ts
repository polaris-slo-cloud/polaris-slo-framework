
/**
 * Describes the available binary operations.
 */
// eslint-disable-next-line no-shadow
export enum BinaryOperator {
    Add = 'add',
    Subtract = 'sub',
    Multiply = 'mul',
    Divide = 'div',
    Modulo = 'mod',
    Power = 'pow',

    /** Intersection of two sets. */
    Intersection = 'intersect',

    /** Union of two sets. */
    Union = 'union',

    /** Relative complement of the second set operand in the first set operand (A \ B). */
    Complement = 'complement',
}
