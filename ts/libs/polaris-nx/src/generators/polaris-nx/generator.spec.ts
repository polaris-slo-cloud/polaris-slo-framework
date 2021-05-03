import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';
import { PolarisNxGeneratorSchema } from './schema';

describe('polaris-nx generator', () => {
    let appTree: Tree;
    const options: PolarisNxGeneratorSchema = { name: 'test' };

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace();
    });

    it('should run successfully', async () => {
        await generator(appTree, options);
        const config = readProjectConfiguration(appTree, 'test');
        expect(config).toBeDefined();
    });
});
