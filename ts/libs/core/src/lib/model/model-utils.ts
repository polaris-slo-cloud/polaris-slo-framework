import { ApiObject } from './api-object.prm';
import { OwnerReference } from './owner-reference.prm';

/**
 * Creates a new {@link OwnerReference} to the specified {@link ApiObject}.
 *
 * The properties `blockOwnerDeletion` and `controller` are not set by this function.
 *
 * @param owner The object, to which the owner reference should point.
 */
 export function createOwnerReference(owner: ApiObject<any>): OwnerReference {
    return new OwnerReference({
        group: owner.objectKind.group,
        version: owner.objectKind.version,
        kind: owner.objectKind.kind,
        name: owner.metadata.name,
        uid: owner.metadata.uid,
    });
}
