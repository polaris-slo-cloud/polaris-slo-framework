import { IsEqualCustomizer, isEqualWith } from 'lodash';

/**
 * Helper function for initializing a model class with a subset of its data in a constructor.
 *
 * Make sure to call this function even if it is already used in the constructor of the superclass.
 * The `initSelf()` call in the superclass will assign all the properties from the `initData`, but
 * if the subclass initializes some of these properties with default values, the default values will
 * overwrite the ones from `initData`. Thus, `initSelf()` needs to be called also in constructors of subclasses.
 *
 * @param self The object to be initialized.
 * @param initData The subset of the data of the object.
 */
export function initSelf<T>(self: T, initData?: Partial<T>): void {
    if (initData) {
        Object.assign(self, initData);
    }
}


/**
 * Recursively compares all enumerable, non-inherited properties of the objects `a` and `b` for value equality,
 * ignoring all constructors.
 *
 * This function should be used when comparing the values of a plain object to those of a class instance.
 *
 * Example:
 * ```
 * export class Person {
 *     constructor(
 *         public name: string,
 *         public surname: string,
 *     ) {}
 * }
 *
 * const a = new Person('John', 'Doe');
 * const b = { name: 'John', surname: 'Doe' };
 *
 * // Returns false, because b is a plain object and thus, does not have `Person` as its constructor.
 * _.isEqual(a, b);
 *
 * // Returns true, because constructors are ignored.
 * isValueEqual(a, b);
 * ```
 *
 * @param a The first object to be compared.
 * @param b The second object to be compared.
 * @returns `true` if `a` and `b` are value-equal, otherwise `false`.
 */
export function isValueEqual(a: any, b: any): boolean {
    return isEqualWith(a, b, isValueEqualCustomizer);
}

const isValueEqualCustomizer: IsEqualCustomizer = (a: unknown, b: unknown, indexOrKey) => {
    if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
        if (a.constructor !== b.constructor) {
            return isValueEqual({ ...a }, { ...b });
        }
    }
    return undefined;
};
