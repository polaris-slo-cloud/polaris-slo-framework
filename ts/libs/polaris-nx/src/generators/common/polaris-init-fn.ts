import * as path from 'path';
import { Tree, generateFiles, joinPathFragments } from '@nrwl/devkit';
import { NormalizedLibraryClassGeneratorSchema, POLARIS_INIT_FN_FILE_NAME, POLARIS_INIT_LIB_FN_NAME } from '../../util';

/**
 * Generates an `initPolarisLib()` function, if it doesn't exist yet, or extends an existing one
 * to register the new type.
 *
 * The type that is registered with the `PolarisTransformationService` is identified by `options.className`.
 *
 * @returns `true` if a new file was generated, otherwise `false`.
 */
export function addOrExtendInitFn(host: Tree, options: NormalizedLibraryClassGeneratorSchema): boolean {
    const folder = joinPathFragments(options.projectSrcRoot, 'lib');
    const initFnFile = joinPathFragments(folder, `${POLARIS_INIT_FN_FILE_NAME}.ts`);

    if (!host.exists(initFnFile)) {
        addPolarisInitFnFile(host, options, folder);
        return true;
    }

    const typeName = options.className;
    console.warn(
        `!!! Important !!!\nPlease add the following line to the ${POLARIS_INIT_LIB_FN_NAME}() function in ${POLARIS_INIT_LIB_FN_NAME}\n` +
        `polarisRuntime.transformer.registerObjectKind(new ${typeName}().objectKind, ${typeName});`,
    );
    return false;
}

function addPolarisInitFnFile(host: Tree, options: NormalizedLibraryClassGeneratorSchema, destFolder: string): void {
    const templateOptions = {
        polarisInitFnFile: POLARIS_INIT_FN_FILE_NAME,
        initPolarisLibFn: POLARIS_INIT_LIB_FN_NAME,
        className: options.className,
        classFileName: options.fileName,
        destDirInLib: options.destDirInLib,
        template: '',
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/polaris-init'),
        destFolder,
        templateOptions,
    );
}
