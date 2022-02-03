import * as path from 'path';
import {
    Generator,
    GeneratorCallback,
    Tree,
    formatFiles,
    generateFiles,
    joinPathFragments,
    names,
    offsetFromRoot,
} from '@nrwl/devkit';
import {
    NPM_PACKAGES,
    SLO_MAPPINGS_DIR,
    VERSIONS,
    addPolarisDependenciesToPackageJson,
    getWorkspaceTsConfigPath,
    runCallbacksSequentially,
} from '../../util';
import { SloMappingGeneratorNormalizedSchema, SloMappingGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SloMapping instance file.
 *
 * // ToDo: Register the slo-mappings directory as a project, turn serialize-slo-mapping into an executor, and adapt polaris-cli command.
 */
const generateComposedMetricType: Generator<SloMappingGeneratorSchema> = async (host: Tree, options: SloMappingGeneratorSchema) => {
    const callbacks: GeneratorCallback[] = [
        addPolarisDependenciesToPackageJson(host, {
            [NPM_PACKAGES.polaris.orchestrators.kubernetes]: VERSIONS.polaris,
        }),
    ];

    const normalizedOptions = normalizeOptions(host, options);

    // Ensure the slo-mappings directory exists.
    ensureSloMappingsDirExists(host);

    // Generate the new SloMapping instance.
    addSloMappingFile(host, normalizedOptions);

    await formatFiles(host);

    return runCallbacksSequentially(...callbacks);
}

// Export the generator function as the default export to enable integration with Nx.
export default generateComposedMetricType;

function normalizeOptions(host: Tree, options: SloMappingGeneratorSchema): SloMappingGeneratorNormalizedSchema {
    const normalizedNames = names(options.name);
    const directory = options.directory ?? '';

    return {
        names: normalizedNames,
        destDir: joinPathFragments(SLO_MAPPINGS_DIR, directory),
        ...options,
        directory,
    };
}

function ensureSloMappingsDirExists(host: Tree): void {
    const tsConfigPath = joinPathFragments(SLO_MAPPINGS_DIR, 'tsconfig.json');
    if (host.exists(tsConfigPath)) {
        return;
    }

    const tsConfigBase = getWorkspaceTsConfigPath(host);
    const templateOptions = {
        tsConfigBase: joinPathFragments(offsetFromRoot(SLO_MAPPINGS_DIR), tsConfigBase),
        template: '', // Used to replace '__template__' with an empty string in file names.
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/slo-mappings-dir'),
        SLO_MAPPINGS_DIR,
        templateOptions,
    );
}

/**
 * Generates the SloMapping instance.
 */
function addSloMappingFile(host: Tree, options: SloMappingGeneratorNormalizedSchema): void {
    const templateOptions = {
        sloMappingTypePkg: options.sloMappingTypePkg,
        sloMappingType: options.sloMappingType,
        fileName: options.names.fileName,
        sloMappingName: options.names.fileName,
        template: '', // Used to replace '__template__' with an empty string in file names.
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/slo-mapping'),
        options.destDir,
        templateOptions,
    );
}
