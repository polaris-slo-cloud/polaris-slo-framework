import { ObjectKind } from '../transformation';

// ObjectKind is the only model type that is not defined in the `model` module.
// This has been done to avoid circular dependencies between `model` and `transformation`.
// ObjectKind is reexported by the `model` module and should be imported from here.

export { ObjectKind };
