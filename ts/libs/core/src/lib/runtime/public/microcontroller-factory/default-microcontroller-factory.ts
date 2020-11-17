import { Constructor, SlocMetadataUtils } from '../../../util';
import { SlocMicrocontrollerFactoryMetadata } from '../../internal';
import { MicrocontrollerFactoryNotRegisteredError } from './errors';
import { FactoryFn, MicrocontrollerFactory } from './microcontroller-factory';

export class DefaultMicrocontrollerFactory<S, C> implements MicrocontrollerFactory<S, C> {

    registerFactoryFn(specType: Constructor<S>, factoryFn: FactoryFn<S, C>): void {
        const metadata: SlocMicrocontrollerFactoryMetadata<S, C> = {
            factoryFn,
        };
        SlocMetadataUtils.setSlocMicrocontrollerFactoryMetadata(metadata, specType);
    }

    createMicrocontroller(spec: S): C {
        const factoryFn = this.getFactoryFn(spec);
        if (!factoryFn) {
            throw new MicrocontrollerFactoryNotRegisteredError(spec);
        }
        return factoryFn(spec);
    }

    private getFactoryFn(spec: S): FactoryFn<S, C> {
        const metadata = SlocMetadataUtils.getSlocMicrocontrollerFactoryMetadata(spec);
        return metadata?.factoryFn;
    }

}
