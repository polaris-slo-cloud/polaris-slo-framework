import { FactoryFn } from '../public/microcontroller-factory/microcontroller-factory';

/**
 * Type metadata used by the `DefaultMicrocontrollerFactory`.
 *
 * This metadata is inheritable.
 *
 * @param S The type of input spec.
 * @param C The type of microcontroller created by the factory.
 */
export interface PolarisMicrocontrollerFactoryMetadata<S, C> {

    /** The factory function that should be used to create a microcontroller for this type of spec. */
    factoryFn: FactoryFn<S, C>;

}
