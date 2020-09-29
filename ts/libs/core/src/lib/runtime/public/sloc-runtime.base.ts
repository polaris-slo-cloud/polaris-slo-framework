import { DefaultSlocTransformationService, SlocTransformationService } from '../../transformation/public/service';
import { SlocRuntime } from './sloc-runtime';

export abstract class SlocRuntimeBase implements SlocRuntime {

    transformer: SlocTransformationService = new DefaultSlocTransformationService();

}
