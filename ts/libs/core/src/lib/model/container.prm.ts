import { PolarisType } from '../transformation';
import { initSelf } from '../util';

/**
 * Describes the resources used/required by a container or set of containers.
 */
export interface Resources {

    /**
     * The memory in MiB.
     *
     * This must be an integer.
     */
    memoryMiB: number;

    /**
     * The CPU cores in milli CPU (1000 milli CPU = 1 CPU core).
     *
     * This must be an integer.
     */
    milliCpu: number;

}

/**
 * Describes the resources used/required by a single container.
 */
export class ContainerResources implements Resources {

    private static readonly resourceNames: (keyof Resources)[] = [ 'memoryMiB', 'milliCpu' ];

    memoryMiB: number;
    milliCpu: number;

    constructor(initData?: Partial<ContainerResources>) {
        initSelf(this, initData);
    }

    /**
     * Applies `scalingFn()` to each of the resource properties and stores the results, normalized to an integer, in a
     * new ContainerResources object, which is returned.
     *
     * @param scalingFn A function that takes the name of the resource and its current value as input and returns its scaled value.
     */
    scale(scalingFn: (resourceName: keyof Resources, currValue: number) => number): ContainerResources {
        const ret = new ContainerResources();
        ContainerResources.resourceNames.forEach(key => {
            const newValue = scalingFn(key, this[key]);
            ret[key] = Math.ceil(newValue);
        });
        return ret;
    }

    /**
     * @returns An array containing all resource names.
     */
    getResourceNames(): (keyof Resources)[] {
        return [ ...ContainerResources.resourceNames ];
    }

}

/**
 * Specification of a container that can be executed in a pod.
 */
export class Container {

    /** The name of the container as a DNS_LABEL. */
    name: string;

    /** Container image name and version. */
    image: string;

    /** The resources requested/used by this container. */
    @PolarisType(() => ContainerResources)
    resources?: ContainerResources;

    // ToDo: Add other properties that may be of interest.

    constructor(initData?: Partial<Container>) {
        initSelf(this, initData);
    }
}
