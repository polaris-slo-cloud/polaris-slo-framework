import { KubeConfig } from '@kubernetes/client-node';
import { CostEfficiencySloMapping, CostEfficiencySloMappingSpec, initSlocLib as initCommonMappingsLib } from '@sloc/common-mappings';
import { initCostEfficiencyMetrics } from '@sloc/cost-efficiency';
import { initSlocKubernetes } from '@sloc/kubernetes';
import { initPrometheusQueryBackend } from '@sloc/prometheus';
import { interval } from 'rxjs';
import { CostEfficiencySlo } from './app/cost-efficiency-slo';

// ToDo: This file should be generated automatically during the build process.
// ToDo: It should be possible to build the SLO controller easily for multiple orchestrators.

// Load the KubeConfig and initialize the @sloc/kubernetes library.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const slocRuntime = initSlocKubernetes(k8sConfig);

// Initialize the Prometheus query backend.
// initPrometheusQueryBackend(slocRuntime, { host: 'prometheus-release-1-prome-prometheus.default' }, true);
// initPrometheusQueryBackend(slocRuntime, { host: 'kubecost-prometheus-server.kubecost.svc', port: 9090 }, true);
initPrometheusQueryBackend(slocRuntime, { host: 'localhost', port: 30900 }, true);

// Initialize the used SLOC mapping libraries
initCommonMappingsLib(slocRuntime);

// Initialize the composed metrics
initCostEfficiencyMetrics(slocRuntime);

// Create an SloControlLoop and register the factories for the ServiceLevelObjectives it will handle
const sloControlLoop = slocRuntime.createSloControlLoop();
sloControlLoop.microcontrollerFactory.registerFactoryFn(CostEfficiencySloMappingSpec, () => new CostEfficiencySlo());

// Create an SloEvaluator and start the control loop with an interval of 20 seconds.
const sloEvaluator = slocRuntime.createSloEvaluator();
sloControlLoop.start({
    evaluator: sloEvaluator,
    interval$: interval(20000),
});

// Create a WatchManager and watch the supported SLO mapping kinds.
const watchManager = slocRuntime.createWatchManager();
watchManager.startWatchers([ new CostEfficiencySloMapping().objectKind ], sloControlLoop.watchHandler)
    .catch(error => void console.error(error))
