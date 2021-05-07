/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { WORKSPACE_NPM_PACKAGE } from './util';


describe('slo-controller e2e', () => {

    beforeAll(() => {
        jest.setTimeout(120000);
    });

    afterAll(() => {
        jest.setTimeout(5000);
    });

    it('should create an slo-controller', async done => {
        const controllerName = uniq('controller-test');
        const sloMappingType = 'CostEfficiencySloMapping';
        const sloMappingTypePkg = '@polaris-sloc/common-mappings';

        ensureNxProject(WORKSPACE_NPM_PACKAGE, 'dist/libs/polaris-nx');

        const result = await runNxCommandAsync(
            `g @polaris-sloc/polaris-nx:slo-controller ${controllerName} --sloMappingTypePkg=${sloMappingTypePkg} --sloMappingType=${sloMappingType}`,
        );
        if (result.stderr) {
            console.log(result.stderr);
        }

        done();
    });

});
