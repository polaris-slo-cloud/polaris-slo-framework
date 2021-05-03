import { PolarisType } from '../transformation';
import { IndexByKey, initSelf } from '../util';

/**
 * Provides metadata about an `ApiObject`.
 *
 * This class is based on `V1ObjectMeta` of Kubernetes and includes a selection of its properties.
 * Most of the docs were taken from https://github.com/kubernetes-client/javascript/blob/master/src/gen/model/v1ObjectMeta.ts
 */
export class ApiObjectMetadata {

    /**
     * Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata.
     * They are not queryable and should be preserved when modifying objects.
     */
    annotations?: IndexByKey<string>;

    /**
     * The timestamp representing the server time when this object was created.
     */
    @PolarisType(() => Date)
    creationTimestamp?: Date;

    /**
     * Map of string keys and values that can be used to organize and categorize (scope and select) objects.
     */
    labels: IndexByKey<string>;

    /**
     * Name must be unique within a namespace. Is required when creating resources
     */
    name: string;

    /**
     * Namespace defines the space within each name must be unique. An empty namespace is equivalent to the `default` namespace.
     */
    namespace?: string;

    /**
     * An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed.
     */
    resourceVersion?: string;

    /**
     * UID is the unique in time and space value for this object.
     */
    uid?: string;

    constructor(initData?: Partial<ApiObjectMetadata>) {
        initSelf(this, initData);
    }

}
