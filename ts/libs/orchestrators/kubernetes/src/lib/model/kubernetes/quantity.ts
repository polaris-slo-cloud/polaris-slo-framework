
/**
 * The multipliers that need to be applied to the raw resource numbers, based on their suffixes
 * to get the scalar value in bytes (for storage) or in CPU cores (for CPUs).
 */
const SUFFIX_MULTIPLIERS = {
    /* eslint-disable @typescript-eslint/naming-convention */

    // Binary suffixes
    Ki: 1024,
    Mi: 1024 * 1024,
    Gi: 1024 * 1024 * 1024,
    Ti: 1024 * 1024 * 1024 * 1024,
    Pi: 1024 * 1024 * 1024 * 1024 * 1024,
    Ei: 1024 * 1024 * 1024 * 1024 * 1024 * 1024,

    // Decimal suffixes
    m: 1 / 1000,
    '': 1,
    k: 1000,
    M: 1000 * 1000,
    G: 1000 * 1000 * 1000,
    T: 1000 * 1000 * 1000 * 1000,
    P: 1000 * 1000 * 1000 * 1000 * 1000,
    E: 1000 * 1000 * 1000 * 1000 * 1000 * 1000,

    /* eslint-enable @typescript-eslint/naming-convention */
}

const NUMBER_REGEX = /[\.0-9]/;

export class KubernetesQuantityParserError extends Error {
    constructor(msg: string, public quantityStr: string, public cause?: Error) {
        super(msg);
    }
}

/**
 * Represents a Kubernetes resource quantity.
 *
 * @see https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity
 */
export class KubernetesQuantity {

    /** The value of this quantity in bytes or CPU cores. */
    private _value: number;

    /**
     * The value of this quantity in bytes or CPU cores.
     */
    get value(): number {
        return this._value;
    }

    /**
     * The value of this quantity in milli-cores or milli-bytes.
     */
    get valueMilli(): number {
        return this._value / SUFFIX_MULTIPLIERS.m;
    }

    /**
     * The value of this quantity in MiB.
     */
    get valueMiB(): number {
        return this._value / SUFFIX_MULTIPLIERS.Mi;
    }

    /**
     * @param bytesOrCpuCores The value of this quantity in bytes or CPU cores.
     */
    constructor(bytesOrCpuCores: number) {
        this._value = bytesOrCpuCores;
    }

    /**
     * Creates a `KubernetesQuantity` form the specified Kubernetes resource quantity string.
     */
    static fromString(quantityStr: string): KubernetesQuantity {
        const suffix = extractSuffix(quantityStr);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const multiplier = (SUFFIX_MULTIPLIERS as any)[suffix];
        if (multiplier === undefined) {
            throw new KubernetesQuantityParserError(`Unknown suffix: '${suffix}'`, quantityStr);
        }

        const value = extractNumber(quantityStr, suffix.length);
        return new KubernetesQuantity(value * multiplier);
    }

    /**
     * Creates a `KubernetesQuantity` form the specified MiB value.
     */
    static fromMib(valueMiB: number): KubernetesQuantity {
        return new KubernetesQuantity(valueMiB * SUFFIX_MULTIPLIERS.Mi);
    }

    /**
     * Creates a `KubernetesQuantity` form the specified milli value.
     */
    static fromMilli(valueMilli: number): KubernetesQuantity {
        return new KubernetesQuantity(valueMilli * SUFFIX_MULTIPLIERS.m);
    }

    /**
     * @returns The value as a string in milli CPU (e.g., `1000m`).
     */
    toMilliString(): string {
        return `${this.valueMilli}m`;
    }

    /**
     * @returns The value as a string in MiB (e.g., `1024Mi`).
     */
    toMiBString(): string {
        return `${this.valueMilli}m`;
    }

}

function extractSuffix(quantityStr: string): string {
    let i = quantityStr.length - 1;
    while (i >= 0 && !NUMBER_REGEX.test(quantityStr.charAt(i))) {
        --i;
    }

    if (i === -1) {
        throw new KubernetesQuantityParserError('Quantity does not contain any numbers.', quantityStr);
    }
    if (i === quantityStr.length - 1) {
        return '';
    }
    return quantityStr.substring(i + 1);
}

function extractNumber(quantityStr: string, suffixLength: number): number {
    const numberStr = quantityStr.substring(0, quantityStr.length - suffixLength);
    // eslint-disable-next-line radix
    const value = Number.parseInt(numberStr);
    if (Number.isNaN(value)) {
        throw new KubernetesQuantityParserError(`Cannot parse numeric value: '${numberStr}'`, quantityStr);
    }
    return value;
}
