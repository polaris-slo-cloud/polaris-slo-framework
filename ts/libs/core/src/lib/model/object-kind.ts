import { initSelf } from '../util';

/**
 * Unambiguously identifies the type of an object within the orchestrator.
 */
export class ObjectKind {

    /** The group/package that the kind is part of. */
    group?: string;

    /** The version of the group/package. */
    version?: string;

    /** The object type within the group/package. */
    kind: string;

    constructor(initData?: Partial<ObjectKind>) {
        initSelf(this, initData);
    }

    /**
     * Creates a string that uniquely identifies the specified object kind.
     *
     * The returned string is of the following format: `group/version/kind`
     *
     * @param kind The `ObjectKind` that should be stringified.
     * @returns The specified object kind as a `group/version/kind` string,
     * which uniquely identifies this object kind.
     */
    static stringify(kind: ObjectKind): string {
        return `${kind.group}/${kind.version}/${kind.kind}`;
    }

}
