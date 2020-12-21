import { SloMapping } from '../../../model';
import { SloControlLoop, SloWatchEventsHandler } from './slo-control-loop';

/**
 * Default `SloWatchEventsHandler` implementation for connecting an `ObjectKindWatcher` to an `SloControlLoop`.
 */
export class DefaultSloWatchEventsHandler implements SloWatchEventsHandler {

    constructor(private controlLoop: SloControlLoop) { }

    onObjectAdded(obj: SloMapping<any, any>): void {
        this.onSloMappingAddedOrModified(obj);
    }

    onObjectModified(obj: SloMapping<any, any>): void {
        this.onSloMappingAddedOrModified(obj);
    }

    onObjectDeleted(obj: SloMapping<any, any>): void {
        const key = this.getFullSloName(obj);
        this.controlLoop.removeSlo(key);
    }

    private getFullSloName(sloMapping: SloMapping<any, any>): string {
        return `${sloMapping.metadata.namespace}.${sloMapping.metadata.name}`;
    }

    private onSloMappingAddedOrModified(sloMapping: SloMapping<any, any>): void {
        const key = this.getFullSloName(sloMapping);
        this.controlLoop.addSlo(key, sloMapping)
            .then()
            .catch(err => console.error(err));
    }

}
