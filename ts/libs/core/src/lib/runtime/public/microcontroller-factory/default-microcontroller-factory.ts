import { Constructor, PolarisMetadataUtils } from '../../../util';
import { PolarisMicrocontrollerFactoryMetadata } from '../../internal';
import { MicrocontrollerFactoryNotRegisteredError } from './errors';
import { FactoryFn, MicrocontrollerFactory } from './microcontroller-factory';

export class DefaultMicrocontrollerFactory<S, C> implements MicrocontrollerFactory<S, C> {

    registerFactoryFn(specType: Constructor<S>, factoryFn: FactoryFn<S, C>): void {
        const metadata: PolarisMicrocontrollerFactoryMetadata<S, C> = {
            factoryFn,
        };
        PolarisMetadataUtils.setPolarisMicrocontrollerFactoryMetadata(metadata, specType);
    }

    createMicrocontroller(spec: S): C {
        const factoryFn = this.getFactoryFn(spec);
        if (!factoryFn) {
            throw new MicrocontrollerFactoryNotRegisteredError(spec);
        }
        return factoryFn(spec);
    }

    private getFactoryFn(spec: S): FactoryFn<S, C> {
        const metadata = PolarisMetadataUtils.getPolarisMicrocontrollerFactoryMetadata(spec);
        return metadata?.factoryFn;
    }

}
