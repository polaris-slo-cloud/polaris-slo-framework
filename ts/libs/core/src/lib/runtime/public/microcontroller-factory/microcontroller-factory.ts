import { Constructor } from '../../../util';

export type FactoryFn<I, O> = (input: I) => O;

/**
 * Used to instantiate a microcontroller for a particular Spec instance, e.g., a `ServiceLevelObjective`
 * instance for an `SloMapping`.
 *
 * @note In Polaris a controller is used to manage a particular `ObjectKind`. Some kinds need only a single
 * controller, while others (e.g., `SloMappings`) require a distinct controller instance for each spec instance.
 * To distinguish between these two controller types, we call the latter ones `microcontrollers`.
 *
 * @important Since registering a factory function may involve modification of constructor metadata,
 * the factory registrations may be shared among all `MicrocontrollerFactories`.
 *
 * Originally an SLO mapping contained a factory method for the `ServiceLevelObjective`, but this proved to be
 * too restrictive, because it required the SLO mapping to be compiled together with the `ServiceLevelObjective`
 * implementation.
 * This would have made the public Polaris libraries larger and would have prevented the packaging of implementations
 * into proprietary applications.
 *
 * @param S The type of input spec.
 * @param C The type of microcontroller created by the factory.
 */
export interface MicrocontrollerFactory<S, C> {

    /**
     * Registers a factory function for a particular type of spec.
     *
     * @param specType The type, for which the factory should be registered.
     * @param factoryFn The factory function to register.
     */
    registerFactoryFn(specType: Constructor<S>, factoryFn: FactoryFn<S, C>): void;

    /**
     * Creates an instance of the microcontroller that has been registered to handle
     * the type of `spec`.
     *
     * If no factory function has been registered for the spec's type, an error is thrown.
     *
     * @param spec The spec, for which to create the microcontroller.
     */
    createMicrocontroller(spec: S): C;

}
