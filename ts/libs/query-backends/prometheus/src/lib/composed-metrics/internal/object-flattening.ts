import { flatten, unflatten } from 'safe-flat';

/** This key is used, if a simple value should be flattened. */
const SINGLE_VALUE_KEY = '.';

export function flattenObject(obj: any): Record<string, number> {
    if (obj === undefined || obj === null) {
        throw new TypeError('Cannot store a value of undefined or null in Prometheus.');
    }
    if (Array.isArray(obj)) {
        throw new TypeError('Cannot store a metric of type Array in Prometheus.');
    }

    switch (typeof obj) {
        case 'number':
            return { [SINGLE_VALUE_KEY]: obj };
        case 'object':
            return flattenAndCheckInternal(obj);
        default:
            throw new TypeError(`Cannot store a metric of type ${typeof obj} in Prometheus.`);
    }
}

export function unflattenObject(flattened: Record<string, number>): any {
    const keys = Object.keys(flattened);
    if (keys.length === 1 && keys[0] === SINGLE_VALUE_KEY) {
        return flattened[SINGLE_VALUE_KEY];
    }
    return unflatten(flattened);
}

function flattenAndCheckInternal(obj: any): Record<string, number> {
    const flattened = flatten(obj);

    Object.keys(flattened).forEach(key => {
        const val = flattened[key];
        if (typeof val !== 'number') {
            throw new TypeError(`Cannot store a metric of type ${typeof val} in Prometheus.`);
        }
    });

    return flattened;
}
