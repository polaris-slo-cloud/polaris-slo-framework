/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { names } from '@nrwl/devkit';
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { WORKSPACE_NPM_ORG, WORKSPACE_NPM_PACKAGE } from './util';


describe('slo-mapping-type e2e', () => {

    beforeAll(() => {
        jest.setTimeout(120000);
    });

    afterAll(() => {
        jest.setTimeout(5000);
    });

    it('should create an slo-mapping-type', async done => {
        const libProj = uniq('mappings-lib');
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

        done();
    });

    // describe('--directory', () => {
    //     it('should create src in the specified directory', async done => {
    //         const plugin = uniq('polaris-nx');
    //         ensureNxProject('@polaris-sloc/polaris-nx', 'dist/libs/polaris-nx');
    //         await runNxCommandAsync(`generate @polaris-sloc/polaris-nx:polaris-nx ${plugin} --directory subdir`);
    //         expect(() => checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)).not.toThrow();
    //         done();
    //     });
    // });

    // describe('--tags', () => {
    //     it('should add tags to nx.json', async done => {
    //         const plugin = uniq('polaris-nx');
    //         ensureNxProject('@polaris-sloc/polaris-nx', 'dist/libs/polaris-nx');
    //         await runNxCommandAsync(`generate @polaris-sloc/polaris-nx:polaris-nx ${plugin} --tags e2etag,e2ePackage`);
    //         const nxJson = readJson('nx.json');
    //         expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    //         done();
    //     });
    // });

});
