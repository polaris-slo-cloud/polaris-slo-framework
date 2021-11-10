import { cloneDeep } from 'lodash';

/**
 * Creates a deep copy of the `src` object, excluding the properties defined by `excludedProperties`.
 */
export function cloneDeepWithoutExcluded<T>(src: T, ...excludedProperties: (keyof T)[]): T {
    const shallowCopy = { ...src };
    excludedProperties.forEach(propKey => delete shallowCopy[propKey]);
    return cloneDeep(shallowCopy);
}
