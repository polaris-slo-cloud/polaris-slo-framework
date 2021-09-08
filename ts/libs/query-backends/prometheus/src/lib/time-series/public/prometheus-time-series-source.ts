import { NativeQueryBuilderFactoryFn, TimeSeriesSourceBase } from '@polaris-sloc/core';
import { PrometheusConfig } from '../../config';
import { PrometheusNativeQueryBuilder } from '../internal';


export class PrometheusTimeSeriesSource extends TimeSeriesSourceBase {

    static readonly fullName = 'polaris-sloc.time-series-sources.Prometheus';

    readonly fullName = PrometheusTimeSeriesSource.fullName;

    constructor(protected config: PrometheusConfig) {
        super();
    }

    protected getNativeQueryBuilderFactory(): NativeQueryBuilderFactoryFn {
        return () => new PrometheusNativeQueryBuilder(this.config);
    }

}
