import {
    Tree,
    formatFiles,
} from '@nrwl/devkit';
import { PredictedMetricControllerGeneratorSchema } from './schema';


export default async function(tree: Tree, options: PredictedMetricControllerGeneratorSchema): Promise<void> {
    await formatFiles(tree);
}
