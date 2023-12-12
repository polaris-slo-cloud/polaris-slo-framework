import * as child_process from 'child_process';
import { Generator, Tree, joinPathFragments } from '@nrwl/devkit';
import { FsTree } from 'nx/src/generators/tree';
import { SLO_MAPPINGS_DIR, getTempDir } from '../../util';
import { apply, createKubeConfig } from '../../util/kubernetes';
import { extractSloMappingPackageName, generateAndWriteScripts } from '../serialize-slo-mapping/generator';
import { ApplySloMappingGeneratorNormalizedSchema, ApplySloMappingGeneratorSchema } from './schema';

/**
 * Generates a temporary script that serializes the SloMapping, executes that script and applies it to the Kubernetes cluster.
 *
 * Actually this should be an executor, because it does not generate any non-temporary files.
 * But Nx CLI requires an executor to be registered in the configuration of a project and the SLO mappings directory is not a project.
 *
 * // ToDo: Register the slo-mappings directory as a project.
 */
const executeApplySloMapping: Generator<ApplySloMappingGeneratorSchema> = async (host: Tree, options: ApplySloMappingGeneratorSchema) => {
    const tempDir = getTempDir(SLO_MAPPINGS_DIR, 'serialize-slo-mapping');

    const normalizedOptions = normalizeOptions(options);

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
        },
    );

    const serializedSlo = result.stdout.toString();

    try {
        const kubeResponse = await apply(createKubeConfig(), serializedSlo);
        console.log(kubeResponse.map((r) => `${r.kind} ${r.metadata?.name} applied`).join('\n'));
    } catch (e) {
        console.error('An error occured while applying SLO:', e.body ?? e.message);
    }
}

export default executeApplySloMapping;

function normalizeOptions(options: ApplySloMappingGeneratorSchema): ApplySloMappingGeneratorNormalizedSchema {
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

function checkSloMapping(host: Tree, options: ApplySloMappingGeneratorNormalizedSchema): void {
    const sloMappingPath = joinPathFragments(SLO_MAPPINGS_DIR, options.sloMappingTsPath);
    if (!host.exists(sloMappingPath)) {
        throw new Error(`The file '${sloMappingPath}' does not exist.`);
    }
}
