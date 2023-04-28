import { KubeConfig } from '@kubernetes/client-node';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CostEfficiencyMetric, CostEfficiencyMetricMapping, initPolarisLib as initCommonMappingsLib } from '@polaris-sloc/common-mappings';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { COMPOSED_METRIC_COMPUTATION_DEFAULT_INTERVAL_MS, Logger } from '@polaris-sloc/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { initCostEfficiencyMetrics } from '@polaris-sloc/cost-efficiency';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PrometheusComposedMetricsCollectorManager, initPrometheusQueryBackend } from '@polaris-sloc/prometheus';
import { CostEfficiencyMetricSourceFactory } from './app/metrics';
import { convertToNumber, getEnvironmentVariable } from './app/util/environment-var-helper';

// Load the KubeConfig and initialize the @polaris-sloc/kubernetes library.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);

// Initialize the used Polaris mapping libraries
initCommonMappingsLib(polarisRuntime);

// Initialize the composed metrics
// ToDo: remove this from SLO controller, because MetricType is enough.
initCostEfficiencyMetrics(polarisRuntime);

// Initialize the Prometheus query backend.
const promHost = getEnvironmentVariable('PROMETHEUS_HOST') || 'localhost';
const promPort = getEnvironmentVariable('PROMETHEUS_PORT', convertToNumber) || 9090;
initPrometheusQueryBackend(polarisRuntime, { host: promHost, port: promPort }, true);

// Initialize any required Polaris mapping or composed metric libraries here.

// Create the Prometheus scrapable endpoint.
const metricsEndpointPath = getEnvironmentVariable('PROMETHEUS_METRICS_ENDPOINT_PATH');
const metricsEndpointPort = getEnvironmentVariable('PROMETHEUS_METRICS_ENDPOINT_PORT', convertToNumber);
const promMetricsCollectorManager = new PrometheusComposedMetricsCollectorManager();
promMetricsCollectorManager.start({ path: metricsEndpointPath, port: metricsEndpointPort });

// Create a ComposedMetricsManager and watch the supported composed metric type kinds.
const manager = polarisRuntime.createComposedMetricsManager();
const intervalMsec = getEnvironmentVariable('COMPOSED_METRIC_COMPUTATION_INTERVAL_MS', convertToNumber) || COMPOSED_METRIC_COMPUTATION_DEFAULT_INTERVAL_MS;
Logger.log(`Starting ComposedMetricsManager with a computation interval of ${intervalMsec} milliseconds.`);
manager
    .startWatching({
        evaluationIntervalMs: intervalMsec,
        collectorFactories: [promMetricsCollectorManager],
        kindsToWatch: [
            {
                mappingKind: new CostEfficiencyMetricMapping().objectKind,
                metricType: CostEfficiencyMetric.instance,
                metricSourceFactory: new CostEfficiencyMetricSourceFactory(),
            },
        ],
    })
    .catch(error => {
        Logger.error(error);
        process.exit(1);
    });
