import { ComposedMetricMapping, ComposedMetricMappingSpec, SloTarget } from '../../../model';
import { executeSafely } from '../../../util';
import { ComposedMetricComputationConfig, ComposedMetricMappingWatchEventsHandler } from './composed-metrics-manager';
import { DefaultComposedMetricsManager } from './default-composed-metrics-manager';

/**
 * Receives watch events for a {@link ComposedMetricMapping} and communicates them to the `ComposedMetricsManager`.
 */
export class DefaultComposedMetricMappingWatchEventsHandler implements ComposedMetricMappingWatchEventsHandler {

    /**
     * Creates a new `DefaultComposedMetricMappingWatchEventsHandler`.
     *
     * @param manager The {@link DefaultComposedMetricsManager} that should be triggered by this watch events handler.
     * @param computationConfig The {@link ComposedMetricComputationConfig} that should be supplied with every mapping.
     */
    constructor(
        private manager: DefaultComposedMetricsManager,
        private computationConfig: ComposedMetricComputationConfig<any>,
    ) { }

    onObjectAdded(obj: ComposedMetricMapping<ComposedMetricMappingSpec<any, SloTarget>>): void {
        executeSafely(() => this.manager.addComposedMetricMapping(obj, this.computationConfig));
    }

    onObjectModified(obj: ComposedMetricMapping<ComposedMetricMappingSpec<any, SloTarget>>): void {
        executeSafely(() => {
            this.manager.removeComposedMetricMapping(obj);
            this.manager.addComposedMetricMapping(obj, this.computationConfig);
        });
    }

    onObjectDeleted(obj: ComposedMetricMapping<ComposedMetricMappingSpec<any, SloTarget>>): void {
        executeSafely(() => this.manager.removeComposedMetricMapping(obj));
    }

}
