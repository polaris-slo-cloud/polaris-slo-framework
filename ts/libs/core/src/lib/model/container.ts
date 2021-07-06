import { PolarisType } from '../transformation';
import { initSelf } from '../util';

/**
 * Describes the resources used/required by a container or set of containers.
 */
export interface Resources {

    /** The memory in MiB. */
    memoryMiB: number;

    /**
     * The CPU cores in milli CPU (1000 milli CPU = 1 CPU core).
     */
    milliCpu: number;

}

/**
 * Describes the resources used/required by a single container.
 */
export class ContainerResources implements Resources {

    memoryMiB: number;
    milliCpu: number;

    constructor(initData?: Partial<ContainerResources>) {
        initSelf(this, initData);
    }

}
