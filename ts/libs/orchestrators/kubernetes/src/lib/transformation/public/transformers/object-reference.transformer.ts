import { Constructor, ObjectKind, ObjectReference, PolarisTransformationService, ReusablePolarisTransformer } from '@polaris-sloc/core';
import { CrossVersionObjectReference } from '../../../model';
import { ObjectKindTransformer } from './object-kind.transformer';

export class ObjectReferenceTransformer implements ReusablePolarisTransformer<ObjectReference, CrossVersionObjectReference> {

    private parentTransformer = new ObjectKindTransformer();

    extractPolarisObjectInitData(
        polarisType: Constructor<ObjectReference>,
        orchPlainObj: CrossVersionObjectReference,
        transformationService: PolarisTransformationService,
    ): Partial<ObjectReference> {
        const initData: Partial<ObjectReference> = this.parentTransformer.extractPolarisObjectInitData(ObjectKind, orchPlainObj, transformationService);
        initData.name = orchPlainObj.name;
        return initData;
    }

    transformToPolarisObject(
        polarisType: Constructor<ObjectReference>,
        orchPlainObj: CrossVersionObjectReference,
        transformationService: PolarisTransformationService,
    ): ObjectReference {
        const initData = this.extractPolarisObjectInitData(polarisType, orchPlainObj, transformationService);
        return new polarisType(initData);
    }

    transformToOrchestratorPlainObject(polarisObj: ObjectReference, transformationService: PolarisTransformationService): CrossVersionObjectReference {
        const plain: CrossVersionObjectReference = this.parentTransformer.transformToOrchestratorPlainObject(polarisObj, transformationService) as any;
        plain.name = polarisObj.name;
        return plain;
    }

}
