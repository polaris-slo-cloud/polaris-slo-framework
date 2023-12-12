import { version as polarisVersion } from '../../../package.json';
import axios from 'axios';
import { extract, type ReadEntry } from 'tar';

type PackageInfo = {
    name: string,
    version: string,
    dist: {
        tarball: string
    }
}

const PACKAGE_REGISTRY_URL = process.env['npm_config_registry'] ?? 'https://npmjs.org/'

/** The name of the Polaris npm organization. */
export const POLARIS_NPM_ORG = '@polaris-sloc';

/**
 * Defines the versions of packages that are currently used.
 */
export const VERSIONS = {
    nx: '16.7.4',
    polaris: polarisVersion,
};

/** Full names of packages. */
export const NPM_PACKAGES = {
    createNxWorkspace: 'create-nx-workspace',

    nrwl: {
        js: '@nx/js',
        node: '@nx/node',
    },

    polaris: {
        nx: `${POLARIS_NPM_ORG}/polaris-nx`,
        cli: `${POLARIS_NPM_ORG}/cli`,
    },
};

export async function getNxVersion(version: string): Promise<string> {
    const info = await getPackageInfo(NPM_PACKAGES.polaris.cli, version);
    const [packagesJs] = await getFilesFromPackage(info, 'package/src/app/util/packages.js');
    const nxVersion = packagesJs.match(/exports.VERSIONS = {\n\s+nx: '(.*)'/)?.[1];
    return nxVersion;
}

export async function getLatestReleaseVersion(): Promise<string> {
    const info = await getPackageInfo(NPM_PACKAGES.polaris.cli, 'latest');
    return info.version;
}

async function getPackageInfo(packageName: string, version = 'latest'): Promise<PackageInfo> {
    const info_url = `${PACKAGE_REGISTRY_URL}${packageName}/${version}`
    const info = await axios.get(info_url).then(r => r.data)
    return info
}

async function getFilesFromPackage(packageInfo: PackageInfo, ...paths: string[]): Promise<string[]> {
    const response_pipe = await axios.get(packageInfo.dist.tarball, { responseType: 'stream' })

    const getEntryForPath = (pathFilter: string) => new Promise<ReadEntry>((resolve, reject) =>
        response_pipe.data
            .pipe(extract({
                filter: (path, _) => path === pathFilter,
                cwd: 'tmp'
            }))
            .once('entry', resolve)
            .on('error', reject)
    )

    const entries = await Promise.all(paths.map(getEntryForPath));
    return Promise.all(entries.map(datafromStream));
}

function datafromStream(stream: ReadEntry): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', (chunk) => {
      data += chunk;
    });
    stream.on('end', () => {
      resolve(data);
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
}
