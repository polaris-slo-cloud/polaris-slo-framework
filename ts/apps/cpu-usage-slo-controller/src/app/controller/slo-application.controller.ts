import { KubeConfig, Watch } from '@kubernetes/client-node';
import { SloControlLoop } from '../control-loop';
import { CpuUsageSloApplication } from '../model';
import { ServiceLevelObjective } from '../sloc-policy-language';
import { CpuUsageSlo } from '../cpu-usage-slo';

type SloApplication = CpuUsageSloApplication;

export class SloApplicationController {

    private controlLoop: SloControlLoop;

    run(k8sConfig: KubeConfig): void {
        this.controlLoop = new SloControlLoop(k8sConfig);
        this.controlLoop.start();

        const watch = new Watch(k8sConfig);
        watch.watch(
            '/apis/slos.sloc.github.io/v1/cpuusagesloapplications',
            {
                allowWatchBookmarks: false,
            },
            (type, apiObj) => {
                switch (type) {
                    case 'ADDED':
                    case 'MODIFIED':
                        this.onSloApplicationAddOrUpdate(apiObj);
                        break;
                    case 'DELETED':
                        this.onSloApplicationDelete(apiObj);
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
            console.log('Started watch on /apis/slos.sloc.github.io/v1/cpuusagesloapplications');
        });

    }

    private onSloApplicationAddOrUpdate(sloApplication: SloApplication): void {
        console.log('Adding/updating SloApplication', sloApplication);

        const slo = this.createSloInstance(sloApplication);
        this.controlLoop.registerSlo(slo);
    }

    private createSloInstance(config: SloApplication): ServiceLevelObjective<any, any> {
        const slo = new CpuUsageSlo();
        slo.configure(config, null);
        return slo;
    }

    private onSloApplicationDelete(sloApplication: SloApplication): void {
        console.log('Deleting SloApplication', sloApplication);
        this.controlLoop.unregisterSlo(sloApplication);
    }

}
