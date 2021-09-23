/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { names } from '@nrwl/devkit';
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { WORKSPACE_NPM_ORG, WORKSPACE_NPM_PACKAGE } from './util';


describe('composed-metric-type e2e', () => {

    it('should create a ComposedMetricType', async () => {
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

});
