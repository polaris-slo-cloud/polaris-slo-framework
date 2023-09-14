import * as fs from 'fs';
import axios from 'axios';

const POLARIS_REPO = 'polaris-slo-cloud/polaris';
const PACKAGE_JSON_FILE = 'package.json';
const NX_ORG = '@nx';

export async function getNxVersion(version: string): Promise<string> {
    const response = await axios.get(`https://raw.githubusercontent.com/${POLARIS_REPO}/${version}/ts/package.json`);
    const packageJson = await response.data;
    return packageJson.devDependencies.nx;
}

export async function getLatestReleaseVersion(): Promise<string> {
    const response = await axios.get(`https://api.github.com/repos/${POLARIS_REPO}/releases/latest`);
    const latestReleaseTag = await response.data.tag_name;
    return latestReleaseTag;
}

export function getNxPackages(): string[] {
    const packageJson: { devDependencies: [] } = JSON.parse(fs.readFileSync(PACKAGE_JSON_FILE, 'utf-8'));
    return Object.keys(packageJson.devDependencies).filter(pkg => pkg.startsWith(NX_ORG));
}
