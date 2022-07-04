import * as child_process from 'child_process';
import * as path from 'path';
import { Generator, Tree, generateFiles, joinPathFragments, offsetFromRoot } from '@nrwl/devkit';
import { FsTree, flushChanges } from 'nx/src/generators/tree';
import { SLO_MAPPINGS_DIR, getTempDir, getWorkspaceTsConfigPath } from '../../util';
import { SerializeSloMappingGeneratorNormalizedSchema, SerializeSloMappingGeneratorSchema } from './schema';

const COMMON_MAPPINGS_PKG = '@polaris-sloc/common-mappings';

/**
 * Generates a temporary script that serializes the SloMapping and then executes that script.
 *
 * Actually this should be an executor, because it does not generate any non-temporary files.
 * But Nx CLI requires an executor to be registered in the configuration of a project and the SLO mappings directory is not a project.
 *
 * // ToDo: Register the slo-mappings directory as a project.
 */
const executeSerializeSloMapping: Generator<SerializeSloMappingGeneratorSchema> = (host: Tree, options: SerializeSloMappingGeneratorSchema) => {
    const tempDir = getTempDir(SLO_MAPPINGS_DIR, 'serialize-slo-mapping');

    const normalizedOptions = normalizeOptions(options);

    // Needed when we turn this into an executor.
    // const host = new FsTree(context.root, false);

    // We need a different FsTree, because we don't want to write the created files to the console,
    // because the output should only the YAML.
    host = new FsTree(host.root, false);

    // Generate the serialize-slo-mapping script.
    checkSloMapping(host, normalizedOptions);
    const sloMappingTypePkg = extractSloMappingPackageName(host, normalizedOptions);
    generateAndWriteScripts(host, normalizedOptions, sloMappingTypePkg, tempDir);

    // Run the serialize-slo-mapping script.
    const scriptTsConfig = joinPathFragments(tempDir, 'tsconfig.json');
    const scriptTs = joinPathFragments(tempDir, 'serialize-slo-mapping.ts');
    const result = child_process.spawnSync(
        'npx',
        [ 'ts-node', '--project', scriptTsConfig, scriptTs ],
        {
            cwd: host.root,
            stdio: 'inherit',
        },
    );

    // Needed when we turn this into an executor.
    // return Promise.resolve({
    //     success: result.status === 0,
    // });
}

export default executeSerializeSloMapping;

function normalizeOptions(options: SerializeSloMappingGeneratorSchema): SerializeSloMappingGeneratorNormalizedSchema {
    let sloMappingTsPath = options.sloMappingTsPath;
    let sloMappingPathWithoutExtension = options.sloMappingTsPath;
    if (options.sloMappingTsPath.toLowerCase().endsWith('.ts')) {
        sloMappingPathWithoutExtension = options.sloMappingTsPath.substring(0, options.sloMappingTsPath.length - 3);
    } else {
        sloMappingTsPath += '.ts';
    }

    return {
        sloMappingTsPath,
        sloMappingPathWithoutExtension,
        fullSloMappingTsPath: joinPathFragments(SLO_MAPPINGS_DIR, sloMappingTsPath),
        fullSloMappingPathWithoutExtension: joinPathFragments(SLO_MAPPINGS_DIR, sloMappingPathWithoutExtension),
    }
}

function checkSloMapping(host: Tree, options: SerializeSloMappingGeneratorNormalizedSchema): void {
    const sloMappingPath = joinPathFragments(SLO_MAPPINGS_DIR, options.sloMappingTsPath);
    if (!host.exists(sloMappingPath)) {
        throw new Error(`The file '${sloMappingPath}' does not exist.`);
    }
}

/**
 * Extracts the SloMapping's package name from the .ts file using a regular expression.
 */
function extractSloMappingPackageName(host: Tree, options: SerializeSloMappingGeneratorNormalizedSchema): string {
    const sloMappingTsContent = host.read(options.fullSloMappingTsPath);
    const sloMappingTsContentStr = sloMappingTsContent.toString();

    const regex = /import {[\w\d\s\n,]*SloMapping[\w\d\s\n,]*} from [\'\"](@?[\w\d\/-]*)[\'\"];/m
    const result = regex.exec(sloMappingTsContentStr);
    if (Array.isArray(result) && result.length === 2) {
        return result[1];
    }
    throw new Error(`Could not extract SloMapping package name from ${options.fullSloMappingTsPath}`);
}

function generateAndWriteScripts(host: Tree, options: SerializeSloMappingGeneratorNormalizedSchema, sloMappingTypePkg: string, tempDir: string): void {
    const tsConfigBase = getWorkspaceTsConfigPath(host);
    let initCommonMappingsLib = '';
    if ((sloMappingTypePkg as any) !== COMMON_MAPPINGS_PKG) {
        // Originally, we wanted to insert the string below, but the template engine seems to escape
        // single and double quotes as &#39; and &#34;
        // So, we hardcode the string in the template, but only call the function, if it is needed.
        // importCommonMappingsLib = `import { initPolarisLib as initCommonMappings } from '${COMMON_MAPPINGS_PKG}';`;
        initCommonMappingsLib = 'initCommonMappings(polarisRuntime);';
    }

    const templateOptions = {
        tsConfigBase: joinPathFragments(offsetFromRoot(tempDir), tsConfigBase),
        sloMappingTsPath: joinPathFragments(offsetFromRoot(tempDir), options.fullSloMappingPathWithoutExtension),
        sloMappingTypePkg,
        initCommonMappingsLib,
        template: '',
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/serialize-slo-mapping-script'),
        tempDir,
        templateOptions,
    );

    const changes = host.listChanges();
    flushChanges(host.root, changes);
}
