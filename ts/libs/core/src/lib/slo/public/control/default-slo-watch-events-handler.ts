import { SloMappingBase, SloMappingSpec, SloTarget } from '../../../model';
import { SloControlLoop, SloWatchEventsHandler } from './slo-control-loop';

/**
 * Default `SloWatchEventsHandler` implementation for connecting an `ObjectKindWatcher` to an `SloControlLoop`.
 */
export class DefaultSloWatchEventsHandler implements SloWatchEventsHandler {

    constructor(private controlLoop: SloControlLoop) { }

    onObjectAdded(obj: SloMappingBase<SloMappingSpec<any, any, SloTarget>>): void {
        this.onSloMappingAddedOrModified(obj);
    }

    onObjectModified(obj: SloMappingBase<SloMappingSpec<any, any, SloTarget>>): void {
        this.onSloMappingAddedOrModified(obj);
    }

    onObjectDeleted(obj: SloMappingBase<SloMappingSpec<any, any, SloTarget>>): void {
        const key = this.getFullSloName(obj);
        this.controlLoop.removeSlo(key);
    }

    private getFullSloName(sloMapping: SloMappingBase<SloMappingSpec<any, any, SloTarget>>): string {
        return `${sloMapping.metadata.namespace}.${sloMapping.metadata.name}`;
    }

    private onSloMappingAddedOrModified(sloMapping: SloMappingBase<SloMappingSpec<any, any, SloTarget>>): void {
        const key = this.getFullSloName(sloMapping);
        this.controlLoop.addSlo(key, sloMapping.spec)
            .then()
            .catch(err => console.error(err));
    }

}
