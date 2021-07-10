
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
