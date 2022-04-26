import { KubeConfig } from '@kubernetes/client-node';
import { CostEfficiencyMetric, CostEfficiencyMetricMapping, initPolarisLib as initCommonMappingsLib } from '@polaris-sloc/common-mappings';
import { COMPOSED_METRIC_COMPUTATION_DEFAULT_INTERVAL_MS, Logger, convertToNumber, getEnvironmentVariable } from '@polaris-sloc/core';
import { RestApiCostEfficiencyMetricSourceFactory, initCostEfficiencyMetrics } from '@polaris-sloc/cost-efficiency';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import { PrometheusComposedMetricsCollectorManager, initPrometheusQueryBackend } from '@polaris-sloc/prometheus';

// ToDo: It should be possible to build the composed metric controller easily for multiple orchestrators.

// Load the KubeConfig and initialize the @polaris-sloc/kubernetes library.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);

// Initialize the Prometheus query backend.
const promHost = getEnvironmentVariable('PROMETHEUS_HOST') || 'localhost';
const promPort = getEnvironmentVariable('PROMETHEUS_PORT', convertToNumber) || 9090;
initPrometheusQueryBackend(polarisRuntime, { host: promHost, port: promPort }, true);

// Initialize the used Polaris mapping libraries
initCommonMappingsLib(polarisRuntime);

// Initialize the composed metrics
// ToDo: remove this from SLO controller, because MetricType is enough.
initCostEfficiencyMetrics(polarisRuntime);

// Create the Prometheus scrapable endpoint.
const metricsEndpointPath = getEnvironmentVariable('PROMETHEUS_METRICS_ENDPOINT_PATH');
const metricsEndpointPort = getEnvironmentVariable('PROMETHEUS_METRICS_ENDPOINT_PORT', convertToNumber);
const promMetricsCollectorManager = new PrometheusComposedMetricsCollectorManager();
promMetricsCollectorManager.start({ path: metricsEndpointPath, port: metricsEndpointPort });

// Create a ComposedMetricsManager and watch the supported composed metric type kinds.
const manager = polarisRuntime.createComposedMetricsManager();
const intervalMsec = getEnvironmentVariable('COMPOSED_METRIC_COMPUTATION_INTERVAL_MS', convertToNumber) || COMPOSED_METRIC_COMPUTATION_DEFAULT_INTERVAL_MS
Logger.log(`Starting ComposedMetricsManager with a computation interval of ${intervalMsec} milliseconds.`);
manager.startWatching({
    evaluationIntervalMs: intervalMsec,
    collectorFactories: [ promMetricsCollectorManager ],
    kindsToWatch: [
        {
            mappingKind: new CostEfficiencyMetricMapping().objectKind,
            metricType: CostEfficiencyMetric.instance,
            metricSourceFactory: new RestApiCostEfficiencyMetricSourceFactory(),
        },
    ],
}).catch(error => {
    Logger.error(error);
    process.exit(1);
});
