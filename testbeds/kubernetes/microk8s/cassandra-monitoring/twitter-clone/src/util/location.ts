import { GeoLocation } from '../model';

/**
 * @returns A random geo location.
 */
export function generateRandomLocation(): GeoLocation {
    const latitudeSign = generateRandomBoolean() ? 1 : -1;
    const longitudeSign = generateRandomBoolean() ? 1 : -1;

    return {
        latitude: latitudeSign * generateRandomDouble(90),
        longitude: longitudeSign * generateRandomDouble(180),
    };
}

function generateRandomDouble(max: number): number {
    return Math.random() * max;
}

function generateRandomBoolean(): boolean {
    return Math.floor(Math.random() * 1000) % 2 === 0;
}
