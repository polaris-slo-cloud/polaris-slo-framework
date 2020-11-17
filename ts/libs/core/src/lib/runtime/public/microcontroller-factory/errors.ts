
export class MicrocontrollerFactoryNotRegisteredError extends Error {

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(public spec: any) {
        super('No `FactoryFn` was registered for the spec.');
    }

}
