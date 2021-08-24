/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { names } from '@nrwl/devkit';
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { WORKSPACE_NPM_ORG, WORKSPACE_NPM_PACKAGE } from './util';


describe('slo-mapping-type e2e', () => {

    it('should create an ElasticityStrategy type', async () => {
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

});
