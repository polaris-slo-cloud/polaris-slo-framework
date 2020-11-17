import { SlocRuntime } from '@sloc/core';
import { CostEfficiencySloMapping, CpuUsageSloMapping } from './slo';

/**
 * Initializes this library and registers its types with the transformer in the `SlocRuntime`.
 */
export function initSlocLib(slocRuntime: SlocRuntime): void {
    slocRuntime.transformer.registerObjectKind(new CpuUsageSloMapping().objectKind, CpuUsageSloMapping);
    slocRuntime.transformer.registerObjectKind(new CostEfficiencySloMapping().objectKind, CostEfficiencySloMapping);
}
