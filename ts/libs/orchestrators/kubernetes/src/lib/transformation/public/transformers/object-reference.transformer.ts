import { Constructor, ObjectKind, ObjectReference, ReusableSlocTransformer, SlocTransformationService } from '@polaris-sloc/core';
import { CrossVersionObjectReference } from '../../../model';
import { ObjectKindTransformer } from './object-kind.transformer';

export class ObjectReferenceTransformer implements ReusableSlocTransformer<ObjectReference, CrossVersionObjectReference> {

    private parentTransformer = new ObjectKindTransformer();

    extractSlocObjectInitData(
        slocType: Constructor<ObjectReference>,
        orchPlainObj: CrossVersionObjectReference,
        transformationService: SlocTransformationService,
    ): Partial<ObjectReference> {
        const initData: Partial<ObjectReference> = this.parentTransformer.extractSlocObjectInitData(ObjectKind, orchPlainObj, transformationService);
        initData.name = orchPlainObj.name;
        return initData;
    }

    transformToSlocObject(
        slocType: Constructor<ObjectReference>,
        orchPlainObj: CrossVersionObjectReference,
        transformationService: SlocTransformationService,
    ): ObjectReference {
        const initData = this.extractSlocObjectInitData(slocType, orchPlainObj, transformationService);
        return new slocType(initData);
    }

    transformToOrchestratorPlainObject(slocObj: ObjectReference, transformationService: SlocTransformationService): CrossVersionObjectReference {
        const plain: CrossVersionObjectReference = this.parentTransformer.transformToOrchestratorPlainObject(slocObj, transformationService) as any;
        plain.name = slocObj.name;
        return plain;
    }

}
