/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { names } from '@nrwl/devkit';
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { WORKSPACE_NPM_ORG, WORKSPACE_NPM_PACKAGE } from './util';


describe('polaris-nx e2e', () => {

    it('should create an slo-mapping-type', async () => {
        const libProj = uniq('slo-mappings-lib');
        const sloMappingType = uniq('MyTest');
        const sloMappingNames = names(sloMappingType);

        ensureNxProject(WORKSPACE_NPM_PACKAGE, 'dist/libs/polaris-nx');
        // await runNxCommandAsync(`generate @nrwl/node:library ${libProj} --importPath=${WORKSPACE_NPM_ORG}/${libProj} --unitTestRunner=none`);

        // eslint-disable-next-line max-len
        const result = await runNxCommandAsync(`generate @polaris-sloc/polaris-nx:slo-mapping-type ${sloMappingType} --project=${libProj} --createLibProject=true --importPath=${WORKSPACE_NPM_ORG}/${libProj}`);
        if (result.stderr) {
            console.log(result.stderr);
        }
        expect(() => checkFilesExist(
            `libs/${libProj}/src/lib/slo-mappings/${sloMappingNames.fileName}.slo-mapping.ts`,
            `libs/${libProj}/src/lib/init-polaris-lib.ts`,
        )).not.toThrow();

    //     const result = await runNxCommandAsync(`build ${plugin}`);
    //     expect(result.stdout).toContain('Executor ran');
    });

    it('should create an slo-controller', async () => {
        const controllerName = uniq('slo-controller-test');
        const sloMappingType = 'CostEfficiencySloMapping';
        const sloMappingTypePkg = '@polaris-sloc/common-mappings';

        ensureNxProject(WORKSPACE_NPM_PACKAGE, 'dist/libs/polaris-nx');

        const result = await runNxCommandAsync(
            `g @polaris-sloc/polaris-nx:slo-controller ${controllerName} --sloMappingTypePkg=${sloMappingTypePkg} --sloMappingType=${sloMappingType}`,
        );
        if (result.stderr) {
            console.log(result.stderr);
        }
        expect(() => checkFilesExist(
            `apps/${controllerName}/src/app/slo/cost-efficiency.slo.ts`,
            `apps/${controllerName}/src/app/slo/index.ts`,
            `apps/${controllerName}/src/app/util/environment-var-helper.ts`,
            `apps/${controllerName}/src/main.ts`,
            `apps/${controllerName}/manifests/kubernetes/1-rbac.yaml`,
            `apps/${controllerName}/manifests/kubernetes/2-slo-controller.yaml`,
            `apps/${controllerName}/Dockerfile`,
            '.dockerignore',
        )).not.toThrow();
    });

    it('should create an elasticity-strategy type', async () => {
        const libProj = uniq('elasticity-mappings-lib');
        const elasticityStrategyType = uniq('MyTest') + 'ElasticityStrategy';
        const elasticityStrategyNames = names(elasticityStrategyType);

        ensureNxProject(WORKSPACE_NPM_PACKAGE, 'dist/libs/polaris-nx');
        // await runNxCommandAsync(`generate @nrwl/node:library ${libProj} --importPath=${WORKSPACE_NPM_ORG}/${libProj} --unitTestRunner=none`);

        // eslint-disable-next-line max-len
        const result = await runNxCommandAsync(`generate @polaris-sloc/polaris-nx:elasticity-strategy ${elasticityStrategyType} --project=${libProj} --createLibProject=true --importPath=${WORKSPACE_NPM_ORG}/${libProj}`);
        if (result.stderr) {
            console.log(result.stderr);
        }
        expect(() => checkFilesExist(
            `libs/${libProj}/src/lib/elasticity/${elasticityStrategyNames.fileName}.ts`,
            `libs/${libProj}/src/lib/init-polaris-lib.ts`,
        )).not.toThrow();
    });

    it('should create an elasticity-strategy-controller', async () => {
        const controllerName = uniq('elasticity-strategy-controller-test');
        const eStratType = 'HorizontalElasticityStrategy';
        const eStratTypePkg = '@polaris-sloc/common-mappings';

        ensureNxProject(WORKSPACE_NPM_PACKAGE, 'dist/libs/polaris-nx');

        const result = await runNxCommandAsync(
            `g @polaris-sloc/polaris-nx:elasticity-strategy-controller ${controllerName} --eStratTypePkg=${eStratTypePkg} --eStratType=${eStratType}`,
        );
        if (result.stderr) {
            console.log(result.stderr);
        }
        expect(() => checkFilesExist(
            `apps/${controllerName}/src/app/elasticity/horizontal-elasticity-strategy-controller.ts`,
            `apps/${controllerName}/src/app/elasticity/index.ts`,
            `apps/${controllerName}/src/main.ts`,
            `apps/${controllerName}/manifests/kubernetes/1-rbac.yaml`,
            `apps/${controllerName}/manifests/kubernetes/2-elasticity-strategy-controller.yaml`,
            `apps/${controllerName}/Dockerfile`,
            '.dockerignore',
        )).not.toThrow();
    });

    it('should create a composed-metric-type', async () => {
        const libProj = uniq('composed-metrics-lib');
        const compMetricName = uniq('MyTest') + 'ComposedMetric';
        const compMetricNames = names(compMetricName);

        ensureNxProject(WORKSPACE_NPM_PACKAGE, 'dist/libs/polaris-nx');
        // await runNxCommandAsync(`generate @nrwl/node:library ${libProj} --importPath=${WORKSPACE_NPM_ORG}/${libProj} --unitTestRunner=none`);

        // eslint-disable-next-line max-len
        const result = await runNxCommandAsync(`generate @polaris-sloc/polaris-nx:composed-metric-type ${compMetricName} --project=${libProj} --createLibProject=true --importPath=${WORKSPACE_NPM_ORG}/${libProj}`);
        if (result.stderr) {
            console.log(result.stderr);
        }
        expect(() => checkFilesExist(
            `libs/${libProj}/src/lib/metrics/${compMetricNames.fileName}.ts`,
            `libs/${libProj}/src/lib/init-polaris-lib.ts`,
        )).not.toThrow();
    });

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
