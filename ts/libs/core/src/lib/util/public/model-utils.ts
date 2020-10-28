
/**
 * Helper function for initializing a model class with a subset of its data in a constructor.
 *
 * @param self The object to be initialized.
 * @param initData The subset of the data of the object.
 */
export function initSelf<T>(self: T, initData?: Partial<T>): void {
    if (initData) {
        Object.assign(self, initData);
    }
}
