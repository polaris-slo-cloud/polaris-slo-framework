
/**
 * @returns The plural form of the specified `singular`.
 */
export function getPlural(singular: string): string {
    if (singular.endsWith('y')) {
        return singular.substring(0, singular.length - 1) + 'ies';
    }
    return singular + 's';
}
