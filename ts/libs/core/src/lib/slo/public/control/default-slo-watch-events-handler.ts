import { SloMappingBase } from '../../../model';
import { SloControlLoop, SloWatchEventsHandler } from './slo-control-loop';

/**
 * Default `SloWatchEventsHandler` implementation for connecting an `ObjectKindWatcher` to an `SloControlLoop`.
 */
export class DefaultSloWatchEventsHandler implements SloWatchEventsHandler {

    constructor(private controlLoop: SloControlLoop) { }

    onObjectAdded(obj: SloMappingBase<any>): void {
        this.onSloMappingAddedOrModified(obj);
    }

    onObjectModified(obj: SloMappingBase<any>): void {
        this.onSloMappingAddedOrModified(obj);
    }

    onObjectDeleted(obj: SloMappingBase<any>): void {
        const key = this.getFullSloName(obj);
        this.controlLoop.removeSlo(key);
    }

    private getFullSloName(sloMapping: SloMappingBase<any>): string {
        return `${sloMapping.metadata.namespace}.${sloMapping.metadata.name}`;
    }

    private onSloMappingAddedOrModified(sloMapping: SloMappingBase<any>): void {
        const key = this.getFullSloName(sloMapping);
        this.controlLoop.addSlo(key, sloMapping.spec)
            .then()
            .catch(err => console.error(err));
    }

}
