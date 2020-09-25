import { SlocRuntime, SlocTransformationService } from '@sloc/core';

export class KubernetesSlocRuntime implements SlocRuntime {

    transformer: SlocTransformationService;

}
