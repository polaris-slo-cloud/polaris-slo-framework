import { PolarisRuntime } from '@polaris-sloc/core';
import { CostEfficiencySloMapping, CpuUsageSloMapping } from './slo';
import { RestServiceTarget } from './slo-targets';

/**
 * Initializes this library and registers its types with the transformer in the `PolarisRuntime`.
 */
export function initPolarisLib(slocRuntime: PolarisRuntime): void {
    slocRuntime.transformer.registerObjectKind(new RestServiceTarget(), RestServiceTarget);
    slocRuntime.transformer.registerObjectKind(new CpuUsageSloMapping().objectKind, CpuUsageSloMapping);
    slocRuntime.transformer.registerObjectKind(new CostEfficiencySloMapping().objectKind, CostEfficiencySloMapping);
}
