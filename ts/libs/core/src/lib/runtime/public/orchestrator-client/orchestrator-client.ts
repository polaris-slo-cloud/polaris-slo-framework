import { ApiObject, NamespacedObjectReference, Scale } from '../../../model';

/**
 * A client for performing CRUD operations on single `ApiObjects` on the orchestrator.
 *
 * Transformations between Polaris objects and orchestrator-specific objects are handled automatically.
 *
 * All methods that return a promise, reject that promise using an `OrchestratorRequestError`, if any error occurs.
 */
export interface OrchestratorClient {

    /**
     * Creates the specified object in the orchestrator.
     *
     * @param newObj The object to be created.
     * @returns A promise that resolves to the new object, as returned by the orchestrator.
     * In case of an error, the promise rejects with an `OrchestratorRequestError`.
     */
    create<T extends ApiObject<any>>(newObj: T): Promise<T>;

    /**
     * Reads the object matched by the `query` from the orchestrator.
     *
     * @note Reading lists is currently not supported, but may be added in the future, if needed.
     *
     * @param query The `ObjectKind` and `ApiObjectMetadata` that identify the object to be read - the `spec` property is not required.
     * This must be an instance of an `ApiObject` class to ensure that transformation works correctly.
     * @returns A promise that resolves to the desired object. If the object cannot be found or in other
     * error cases, the promise rejects with an `OrchestratorRequestError`.
     */
    read<T extends ApiObject<any>>(query: T): Promise<T>;

    /**
     * Updates (replaces) an existing object
     *
     * @param obj The object to be updated.
     * @returns A promise that resolves to the new or updated object, as returned by the orchestrator.
     * In case of an error, the promise rejects with an `OrchestratorRequestError`.
     */
    update<T extends ApiObject<any>>(obj: T): Promise<T>;

    /**
     * Deletes the object matched by the `query` object from the orchestrator.
     *
     * @param query The `ObjectKind` and `ApiObjectMetadata` that identify the object to be deleted - the `spec` property is not required.
     * @returns A promise that resolves to `void` if the deletion completed successfully.
     * In case of an error, the promise rejects with an `OrchestratorRequestError`.
     */
    delete<T extends ApiObject<any>>(query: T): Promise<void>;

    /**
     * Gets the scale of a scalable `ApiObject`.
     *
     * @param target The target object, for which to get the reference.
     * @returns A promise that resolves to a `Scale` object. In case of an error (also if the target is not scalable),
     * the promise rejects with an `OrchestratorRequestError`.
     */
    getScale(target: NamespacedObjectReference): Promise<Scale>;

    /**
     * Sets the scale of a scalable `ApiObject`.
     *
     * @param target The target object, for which to get the reference.
     * @param newScale The new scale object to be set on the target.
     * @returns A promise that resolves to the updated `Scale` object, as returned by the orchestrator.
     * In case of an error (also if the target is not scalable), the promise rejects with an `OrchestratorRequestError`.
     */
    setScale(target: NamespacedObjectReference, newScale: Scale): Promise<Scale>;

}
