import { PolarisMicrocontrollerFactoryMetadata } from '../../../transformation/internal/polaris-microcontroller-factory-metadata';
import { PolarisMetadataUtils } from '../../../transformation/internal/reflect-metadata-utils';
import { Constructor, FactoryFn } from '../../../util';
import { MicrocontrollerFactoryNotRegisteredError } from './errors';
import { MicrocontrollerFactory } from './microcontroller-factory';

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
