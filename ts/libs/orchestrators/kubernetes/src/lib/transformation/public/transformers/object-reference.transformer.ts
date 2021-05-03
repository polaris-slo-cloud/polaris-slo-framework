import { Constructor, ObjectKind, ObjectReference, PolarisTransformationService, ReusablePolarisTransformer } from '@polaris-sloc/core';
import { CrossVersionObjectReference } from '../../../model';
import { ObjectKindTransformer } from './object-kind.transformer';

export class ObjectReferenceTransformer implements ReusablePolarisTransformer<ObjectReference, CrossVersionObjectReference> {

    private parentTransformer = new ObjectKindTransformer();

    extractPolarisObjectInitData(
        slocType: Constructor<ObjectReference>,
        orchPlainObj: CrossVersionObjectReference,
        transformationService: PolarisTransformationService,
    ): Partial<ObjectReference> {
        const initData: Partial<ObjectReference> = this.parentTransformer.extractPolarisObjectInitData(ObjectKind, orchPlainObj, transformationService);
        initData.name = orchPlainObj.name;
        return initData;
    }

    transformToPolarisObject(
        slocType: Constructor<ObjectReference>,
        orchPlainObj: CrossVersionObjectReference,
        transformationService: PolarisTransformationService,
    ): ObjectReference {
        const initData = this.extractPolarisObjectInitData(slocType, orchPlainObj, transformationService);
        return new slocType(initData);
    }

    transformToOrchestratorPlainObject(slocObj: ObjectReference, transformationService: PolarisTransformationService): CrossVersionObjectReference {
        const plain: CrossVersionObjectReference = this.parentTransformer.transformToOrchestratorPlainObject(slocObj, transformationService) as any;
        plain.name = slocObj.name;
        return plain;
    }

}
