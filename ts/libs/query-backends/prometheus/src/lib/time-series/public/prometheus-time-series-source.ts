import { NativeQueryBuilderFactoryFn, TimeSeriesSourceBase } from '@polaris-sloc/core';
import { PrometheusConfig } from '../../config';
import { PrometheusNativeQueryBuilder } from '../internal';


export class PrometheusTimeSeriesSource extends TimeSeriesSourceBase {

    readonly name = 'sloc.time-series-sources.Prometheus';

    constructor(protected config: PrometheusConfig) {
        super();
    }

    protected getNativeQueryBuilderFactory(): NativeQueryBuilderFactoryFn {
        return () => new PrometheusNativeQueryBuilder(this.config);
    }

}
