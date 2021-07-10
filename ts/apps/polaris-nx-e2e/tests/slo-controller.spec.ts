/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { WORKSPACE_NPM_PACKAGE } from './util';


describe('slo-controller e2e', () => {

    beforeAll(() => {
        jest.setTimeout(120000);
    });

    afterAll(() => {
        jest.setTimeout(5000);
    });

    it('should create an slo-controller', async done => {
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


        done();
    });

});
