import * as child_process from 'child_process';
import * as path from 'path';
import { Executor, ExecutorContext, Tree, generateFiles, joinPathFragments, offsetFromRoot } from '@nrwl/devkit';
import { FsTree, flushChanges } from '@nrwl/tao/src/shared/tree';
import { PolarisCliConfig, PolarisCliError, PolarisCliProjectType, PolarisLibraryProject, getTempDir, getWorkspaceTsConfigPath } from '../../util';
import { GenerateCrdsExecutorSchema } from './schema';

/**
 * Generates a temporary script that generates the CRDs for a Polaris library and executes that script.
 */
const executeGenerateCrds: Executor<GenerateCrdsExecutorSchema> = (options: GenerateCrdsExecutorSchema, context: ExecutorContext) => {
    if (!context.projectName) {
        throw new PolarisCliError('This executor must be run on a project. No projectName found in context.', context);
    }
    const tempDir = getTempDir(context.projectName, 'gen-crds');
    const host = new FsTree(context.root, context.isVerbose);

    // Generate the gen-crds script.
    const lib = getProjectAndCheckCrds(host, context.projectName);
    generateAndWriteScripts(host, lib, tempDir);

    // Run the gen-crds script.
    const scriptTsConfig = joinPathFragments(tempDir, 'tsconfig.json');
    const scriptTs = joinPathFragments(tempDir, 'gen-crds.ts');
    const result = child_process.spawnSync(
        'npx',
        [ 'ts-node', '--project', scriptTsConfig, scriptTs ],
        {
            cwd: context.root,
            stdio: 'inherit',
        },
    );
    return Promise.resolve({
        success: result.status === 0,
    });
}

export default executeGenerateCrds;

function getProjectAndCheckCrds(host: Tree, projectName: string): PolarisLibraryProject {
    const polarisCliConfig = PolarisCliConfig.readFromFile(host);
    const lib = polarisCliConfig.getAndValidateProject(projectName, PolarisCliProjectType.Library);
    if (!lib.crds?.polarisTypes?.length) {
        throw new PolarisCliError(`The project ${projectName} does not have any Polaris types configured as CRDs.`)
    }
    return lib;
}

function generateAndWriteScripts(host: Tree, lib: PolarisLibraryProject, tempDir: string): void {
    const tsConfigBase = getWorkspaceTsConfigPath(host);
    const templateOptions = {
        tsConfigBase: joinPathFragments(offsetFromRoot(tempDir), tsConfigBase),
        crdsPkg: lib.importPath,
        polarisTypesList: lib.crds.polarisTypes.join(',\n    '),
        outDir: lib.crds.outDir,
        libTsConfig: lib.crds.tsConfig,
        tsIndexFile: lib.tsEntryPoint,
        template: '',
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/gen-crds-script'),
        tempDir,
        templateOptions,
    );
    const changes = host.listChanges();
    flushChanges(host.root, changes);
}
