import { SlocRuntime } from '..';
import { DefaultSlocTransformationService, SlocTransformationService } from '../../transformation';

export abstract class SlocRuntimeBase implements SlocRuntime {

    transformer: SlocTransformationService = new DefaultSlocTransformationService();

}
