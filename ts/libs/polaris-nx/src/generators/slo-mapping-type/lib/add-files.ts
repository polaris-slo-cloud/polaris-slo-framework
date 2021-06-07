import * as path from 'path';
import { Tree, generateFiles, joinPathFragments } from '@nrwl/devkit';
import { POLARIS_INIT_FN_FILE_NAME, POLARIS_INIT_LIB_FN_NAME } from '../../../util';
import { SloMappingTypeGeneratorNormalizedSchema } from '../schema';

/**
 * Generates the SLO mapping type.
 */
export function addSloMappingTypeFile(host: Tree, options: SloMappingTypeGeneratorNormalizedSchema): void {
    const templateOptions = {
        className: options.names.className,
        fileName: options.fileNameWithSuffix,
        template: '', // Used to replace '__template__' with an empty string in file names.
    };

    generateFiles(
        host,
        path.join(__dirname, '..', 'files/slo-mapping-type'),
        joinPathFragments(options.projectSrcRoot, options.destDir),
        templateOptions,
    );
}


/**
 * Generates an `initPolarisLib()` function, if it doesn't exist yet, or extends an existing one
 * to register the new SLO mapping type.
 *
 * @returns `true` if a new file was generated, otherwise `false`.
 */
export function addOrExtendInitFn(host: Tree, options: SloMappingTypeGeneratorNormalizedSchema): boolean {
    const folder = joinPathFragments(options.projectSrcRoot, 'lib');
    const initFnFile = joinPathFragments(folder, `${POLARIS_INIT_FN_FILE_NAME}.ts`);

    if (!host.exists(initFnFile)) {
        addPolarisInitFnFile(host, options, folder);
        return true;
    }

    const sloMappingType = options.names.className;
    console.warn(
        `!!! Important !!!\nPlease add the following line to the ${POLARIS_INIT_LIB_FN_NAME}() function in ${POLARIS_INIT_LIB_FN_NAME}\n` +
        `polarisRuntime.transformer.registerObjectKind(new ${sloMappingType}().objectKind, ${sloMappingType});`,
    );
    return false;
}

function addPolarisInitFnFile(host: Tree, options: SloMappingTypeGeneratorNormalizedSchema, destFolder: string): void {
    const templateOptions = {
        polarisInitFnFile: POLARIS_INIT_FN_FILE_NAME,
        initPolarisLibFn: POLARIS_INIT_LIB_FN_NAME,
        sloMappingType: `${options.names.className}SloMapping`,
        sloMappingFileName: options.fileNameWithSuffix,
        destDirInLib: options.destDirInLib,
        template: '',
    };

    generateFiles(
        host,
        path.join(__dirname, '..', 'files/lib-root'),
        destFolder,
        templateOptions,
    );
}
