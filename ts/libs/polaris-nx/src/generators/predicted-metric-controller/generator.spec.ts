import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';
import { PredictedMetricControllerGeneratorSchema } from './schema';

describe('predicted-metric-controller generator', () => {
  let appTree: Tree;
  const options: PredictedMetricControllerGeneratorSchema = { compMetricType: '', compMetricTypePkg: '', name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  })
});
