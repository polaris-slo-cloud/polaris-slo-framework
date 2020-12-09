
export class MicrocontrollerFactoryNotRegisteredError extends Error {

    constructor(public spec: any) {
        super('No `FactoryFn` was registered for the spec.');
    }

}
