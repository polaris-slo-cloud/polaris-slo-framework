import { KubeConfig } from '@kubernetes/client-node';
import { CpuUsageSloMapping, CpuUsageSloMappingSpec, initPolarisLib as initCommonMappingsLib } from '@polaris-sloc/common-mappings';
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import { initPrometheusQueryBackend } from '@polaris-sloc/prometheus';
import { interval } from 'rxjs';
import { CpuUsageSlo } from './app/cpu-usage-slo';

// ToDo: This file should be generated automatically during the build process.
// ToDo: It should be possible to build the SLO controller easily for multiple orchestrators.

// Load the KubeConfig and initialize the @polaris-sloc/kubernetes library.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);

// Initialize the Prometheus query backend.
// initPrometheusQueryBackend(polarisRuntime, { host: 'prometheus-release-1-prome-prometheus.default' }, true);
initPrometheusQueryBackend(polarisRuntime, { host: 'localhost', port: 30900 }, true);

// Initialize the used Polaris mapping libraries
initCommonMappingsLib(polarisRuntime);

// Create an SloControlLoop and register the factories for the ServiceLevelObjectives it will handle
const sloControlLoop = polarisRuntime.createSloControlLoop();
sloControlLoop.microcontrollerFactory.registerFactoryFn(CpuUsageSloMappingSpec, () => new CpuUsageSlo());

// Create an SloEvaluator and start the control loop with an interval of 20 seconds.
const sloEvaluator = polarisRuntime.createSloEvaluator();
sloControlLoop.start({
    evaluator: sloEvaluator,
    interval$: interval(20000),
});

// Create a WatchManager and watch the supported SLO mapping kinds.
const watchManager = polarisRuntime.createWatchManager();
watchManager.startWatchers([ new CpuUsageSloMapping().objectKind ], sloControlLoop.watchHandler)
    .catch(error => void console.error(error))
