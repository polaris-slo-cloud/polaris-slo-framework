/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { checkFilesExist, ensureNxProject, readJson, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
describe('polaris-nx e2e', () => {
    it('should create polaris-nx', async done => {
        const plugin = uniq('polaris-nx');
        ensureNxProject('@polaris-sloc/polaris-nx', 'dist/libs/polaris-nx');
        await runNxCommandAsync(`generate @polaris-sloc/polaris-nx:polaris-nx ${plugin}`);

        const result = await runNxCommandAsync(`build ${plugin}`);
        expect(result.stdout).toContain('Executor ran');

        done();
    });

    describe('--directory', () => {
        it('should create src in the specified directory', async done => {
            const plugin = uniq('polaris-nx');
            ensureNxProject('@polaris-sloc/polaris-nx', 'dist/libs/polaris-nx');
            await runNxCommandAsync(`generate @polaris-sloc/polaris-nx:polaris-nx ${plugin} --directory subdir`);
            expect(() => checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)).not.toThrow();
            done();
        });
    });

    describe('--tags', () => {
        it('should add tags to nx.json', async done => {
            const plugin = uniq('polaris-nx');
            ensureNxProject('@polaris-sloc/polaris-nx', 'dist/libs/polaris-nx');
            await runNxCommandAsync(`generate @polaris-sloc/polaris-nx:polaris-nx ${plugin} --tags e2etag,e2ePackage`);
            const nxJson = readJson('nx.json');
            expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
            done();
        });
    });
});
