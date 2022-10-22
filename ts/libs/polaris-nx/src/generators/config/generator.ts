import { Tree } from '@nrwl/devkit';
import { PolarisCliConfig } from '../../util';
import { ConfigurationSchema } from './schema';

type KeyType = 'dockerImageName' | 'dockerImageTags';

export default async function (host: Tree, options: ConfigurationSchema): Promise<void> {
    try {
        const { modifier, project, key: _key, value } = options;
        const key = _key as KeyType;

        if (!isValidModifier(modifier) || !isValidKey(options.key)) return Promise.reject('Modifier or key are not valid!');

        const polarisCliConfig = PolarisCliConfig.readFromFile(host);
        const projectConfig = polarisCliConfig.getProject(project);

        if (modifier === 'get') {
            console.log(projectConfig[key]);
        }

        if (modifier === 'set') {
            if (value === undefined) return Promise.reject('Please specify the value to be set');
            projectConfig[key] = value;
            polarisCliConfig.writeToFile();
            return Promise.resolve();
        }
    } catch (e) {
        return Promise.reject(e);
    }
}

const isValidModifier = (modifier: string): boolean => modifier === 'get' || modifier === 'set';
const isValidKey = (key: string): boolean => key === 'dockerImageName' || key === 'dockerImageTags';
