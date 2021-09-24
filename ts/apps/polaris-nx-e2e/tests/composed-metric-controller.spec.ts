/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { WORKSPACE_NPM_PACKAGE } from './util';


describe('composed-metric-controller e2e', () => {

    it('should create a composed-metric-controller', async () => {
        const controllerName = uniq('composed-metric-controller-test');
        const compMetricType = 'CostEfficiencyMetric';
        const compMetricTypePkg = '@polaris-sloc/common-mappings';

        ensureNxProject(WORKSPACE_NPM_PACKAGE, 'dist/libs/polaris-nx');

        const result = await runNxCommandAsync(
            // eslint-disable-next-line max-len
            `g @polaris-sloc/polaris-nx:composed-metric-controller ${controllerName} --compMetricTypePkg=${compMetricTypePkg} --compMetricType=${compMetricType}`,
        );
        if (result.stderr) {
            console.log(result.stderr);
        }
        expect(() => checkFilesExist(
            `apps/${controllerName}/src/app/metrics/cost-efficiency/cost-efficiency-metric-source.ts`,
            `apps/${controllerName}/src/app/metrics/cost-efficiency/cost-efficiency-metric-source.factory.ts`,
            `apps/${controllerName}/src/app/metrics/cost-efficiency/index.ts`,
            `apps/${controllerName}/src/app/metrics/index.ts`,
            `apps/${controllerName}/src/main.ts`,
            `apps/${controllerName}/manifests/kubernetes/1-rbac.yaml`,
            `apps/${controllerName}/manifests/kubernetes/2-metrics-controller.yaml`,
            `apps/${controllerName}/manifests/kubernetes/3-service-monitor.yaml`,
            `apps/${controllerName}/Dockerfile`,
            '.dockerignore',
        )).not.toThrow();
    });

});
