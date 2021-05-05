import { names } from '@nrwl/devkit';

/**
 * Represents a set of commonly used forms of the same name.
 */
export interface NormalizedNames {

    /**
     * The name given as input.
     */
    name: string;

    /**
     * @example 'MyName'
     */
    className: string;

    /**
     * @example 'myName'
     */
    propertyName: string;

    /**
     * @example 'MY_NAME'
     */
    constantName: string;

    /**
     * @example 'my-name'
     */
    fileName: string;
}

/**
 * Generates commonly used, normalized forms of the specified `name` and appends a `suffix`.
 *
 * For file names, a dot is placed before the suffix (e.g., `my-name.template`)
 *
 * @see name() function from `@nrwl/devkit`
 *
 * @param name The name to be normalized - can be specified in camelCase, PascalCase, or kebab-case.
 * @param suffix The suffix to be appended to `name` before normalization - can be specified in camelCase, PascalCase, or kebab-case.
 */
export function namesWithSuffix(name: string, suffix: string): NormalizedNames {
    const normalizedSuffix = names(suffix);
    const origName = name;

    if (!hasSuffix(name, normalizedSuffix)) {
        if (name.indexOf('-') === -1) {
            name += normalizedSuffix.className;
        } else {
            name += '-' + normalizedSuffix.fileName;
        }
    }

    const normalizedNames = names(name);
    normalizedNames.name = origName;

    // Replace the '-' before the suffix with a '.' in the file name.
    normalizedNames.fileName += '.' + normalizedSuffix.fileName;
    if (normalizedNames.fileName.length > normalizedSuffix.fileName.length) {
        const dashIndex = normalizedNames.fileName.length - normalizedSuffix.fileName.length - 1;
        const fileNameBeforeSuffix = normalizedNames.fileName.substring(0, dashIndex);
        normalizedNames.fileName = `${fileNameBeforeSuffix}.${normalizedSuffix.fileName}`;
    }

    return normalizedNames;
}

function hasSuffix(name: string, normalizedSuffix: NormalizedNames): boolean {
    for (const key of (Object.keys(normalizedSuffix) as (keyof NormalizedNames)[])) {
        const suffix = normalizedSuffix[key];
        if (name.endsWith(suffix)) {
            return true;
        }
    }
    return false;
}
