import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';
import { GrafanaDashboardGeneratorSchema } from './schema';

describe('metrics-dashboard generator', () => {
    let appTree: Tree;
    const options: GrafanaDashboardGeneratorSchema = {
        asRate: false,
        dashboard: '',
        directory: '',
        panelType: '',
        refresh: '',
        tags: '',
        name: 'test',
    };

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace();
    });

    it('should run successfully', async () => {
        await generator(appTree, options);
        const config = readProjectConfiguration(appTree, 'test');
        expect(config).toBeDefined();
    });
});
