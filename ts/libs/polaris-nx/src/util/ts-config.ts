/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Tree, joinPathFragments, readJson, readProjectConfiguration, updateJson } from '@nx/devkit';

const TS_CONFIG_FILES = [
    'tsconfig.base.json',
    'tsconfig.json',
];

/**
 * Adapts the global tsconfig file for use with Polaris.
 *
 * Specifically, this enables the `experimentalDecorators` compiler option.
 */
export function adaptTsConfigForPolaris(host: Tree): void {
    const tsConfigPath = getWorkspaceTsConfigPath(host);
    if (!tsConfigPath) {
        console.error('Could not find the workspace\'s global tsconfig file. ' +
            'Please activate "experimentalDecorators" in the "compilerOptions" of your tsconfig manually.');
        return;
    }

    updateJson(host, tsConfigPath, json => {
        if (json.compilerOptions) {
            json.compilerOptions.experimentalDecorators = true;
        } else {
            json.compilerOptions = { experimentalDecorators: true };
        }
        return json;
    });
}

/**
 * Changes the module code generation type for the specified library project to 'commonjs'.
 *
 * @note We use the CommonJS module format, because TypeScript does not modify the import statements
 * when generating ES2015/ES2020 modules. This results in invalid import paths, because
 * ECMAScript module path imports always need to include the file extension. For now,
 * the easiest way around this, is to use CommonJS.
 * See:
 * - https://nodejs.org/api/esm.html#import-specifiers
 * - https://github.com/microsoft/TypeScript/issues/40878
 * - https://github.com/microsoft/TypeScript/issues/42151
 */
export function adaptLibModuleTypeForPolaris(host: Tree, projectName: string): void {
    const project = readProjectConfiguration(host, projectName);
    const tsConfigs = [
        joinPathFragments(project.root, 'tsconfig.lib.json'),
        // joinPathFragments(project.root, 'tsconfig.spec.json'),
    ];

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const updateFn = (json: any) => {
        if (json.compilerOptions) {
            json.compilerOptions.module = 'commonjs';
        } else {
            json.compilerOptions = { module: 'commonjs' };
        }
        return json;
    };

    tsConfigs.forEach(tsConfig => {
        if (host.exists(tsConfig)) {
            updateJson(host, tsConfig, updateFn);
        }
    });

    const packageJson = joinPathFragments(project.root, 'package.json');
    if (host.exists(packageJson)) {
        updateJson(host, packageJson, json => {
            json.type = 'commonjs';
            return json;
        });
    }
}

/**
 * Configures `tsconfig.lib.json` to embed the TS source code into the source maps by setting
 * `"inlineSources": true`.
 *
 * Otherwise the source maps would point to .ts files, which are not bundled in the npm packages.
 * This is a solution found here: https://github.com/nrwl/nx/issues/11179#issuecomment-1263474100
 */
export function enableEmbeddingSourcesInSourceMaps(host: Tree, projectName: string): void {
    const project = readProjectConfiguration(host, projectName);
    const tsConfigs = [
        joinPathFragments(project.root, 'tsconfig.lib.json'),
        // joinPathFragments(project.root, 'tsconfig.spec.json'),
    ];

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const updateFn = (json: any) => {
        if (json.compilerOptions) {
            json.compilerOptions.inlineSources = true;
        } else {
            json.compilerOptions = { inlineSources: true };
        }
        return json;
    };

    tsConfigs.forEach(tsConfig => {
        if (host.exists(tsConfig)) {
            updateJson(host, tsConfig, updateFn);
        }
    });
}

/**
 * Checks if he specified `npmPackage` is remapped in the tsconfig `paths`.
 *
 * If it is remapped, the package's source is likely contained in the local monorepo and
 * thus, the package must not be installed through the package manager.
 *
 * @returns `true` if the specified `npmPackage` is remapped in the tsconfig `paths`, otherwise `false.
 */
export function checkIfPackageIsInPaths(host: Tree, npmPackage: string): boolean {
    const tsConfigPath = getWorkspaceTsConfigPath(host);
    if (!tsConfigPath) {
        return false;
    }

    const tsConfigJson = readJson(host, tsConfigPath);
    const mappedPaths = tsConfigJson?.compilerOptions?.paths;
    return !!mappedPaths && !!mappedPaths[npmPackage];
}

/**
 * @returns The path of the workspace's global tsconfig file or `undefined` if it cannot be found.
 */
export function getWorkspaceTsConfigPath(host: Tree): string {
    return TS_CONFIG_FILES.find(path => host.exists(path));
}
