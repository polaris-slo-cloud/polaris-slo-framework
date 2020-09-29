import { IndexByKey } from '../../../util';
import { ServiceLevelObjective } from '../common';
import { SloControlLoop, SloControlLoopConfig } from './slo-control-loop';

/**
 * The default SLO control loop implementation, which can be used for most orchestrators.
 */
export class DefaultSloControlLoop implements SloControlLoop {

    isActive: boolean;

    addSlo(key: string, slo: ServiceLevelObjective<any, any>): void {
        throw new Error('Method not implemented.');
    }

    getSlo(key: string): ServiceLevelObjective<any, any> {
        throw new Error('Method not implemented.');
    }

    removeSlo(key: string): boolean {
        throw new Error('Method not implemented.');
    }

    getAllSlos(): IndexByKey<ServiceLevelObjective<any, any>> {
        throw new Error('Method not implemented.');
    }

    start(config: SloControlLoopConfig): void {
        throw new Error('Method not implemented.');
    }

    stop(): void {
        throw new Error('Method not implemented.');
    }

}
