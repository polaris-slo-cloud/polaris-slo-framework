import * as path from 'path';
import { Tree, generateFiles, names, offsetFromRoot } from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';


export function addFiles(host: Tree, options: NormalizedSchema): void {
    const templateOptions = {
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        template: '',
    };
    generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}
