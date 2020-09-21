import { KubeConfig, Watch } from '@kubernetes/client-node';
import { SloControlLoop } from '../control-loop';
import { CpuUsageSloMapping } from '../model';
import { ServiceLevelObjective } from '../sloc-policy-language';
import { CpuUsageSlo } from '../cpu-usage-slo';

type SloMapping = CpuUsageSloMapping;

export class SloMappingController {

    private controlLoop: SloControlLoop;

    run(k8sConfig: KubeConfig): void {
        this.controlLoop = new SloControlLoop(k8sConfig);
        this.controlLoop.start();

        const watch = new Watch(k8sConfig);
        watch.watch(
            '/apis/slo.sloc.github.io/v1/cpuusageslomappings',
            {
                allowWatchBookmarks: false,
            },
            (type, apiObj) => {
                switch (type) {
                    case 'ADDED':
                    case 'MODIFIED':
                        this.onSloMappingAddOrUpdate(apiObj);
                        break;
                    case 'DELETED':
                        this.onSloMappingDelete(apiObj);
                        break;
                    default:
                        break;
                }
            },
            // done callback is called if the watch terminates normally
            (err) => {
                console.log(err);
                this.controlLoop.stop();
            })
        .then((req) => {
            // watch returns a request object which you can use to abort the watch.
            console.log('Started watch on /apis/slo.sloc.github.io/v1/cpuusageslomappings');
        });

    }

    private onSloMappingAddOrUpdate(sloMapping: SloMapping): void {
        console.log('Adding/updating SloMapping', sloMapping);

        const slo = this.createSloInstance(sloMapping);
        this.controlLoop.registerSlo(slo);
    }

    private createSloInstance(config: SloMapping): ServiceLevelObjective<any, any> {
        const slo = new CpuUsageSlo();
        slo.configure(config, null);
        return slo;
    }

    private onSloMappingDelete(sloMapping: SloMapping): void {
        console.log('Deleting SloMapping', sloMapping);
        this.controlLoop.unregisterSlo(sloMapping);
    }

}
