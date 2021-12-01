import { ComposedMetricMapping, ComposedMetricParams, ComposedMetricType } from '../../../model';

/**
 * Error thrown by composed metric implementations.
 */
export class ComposedMetricError extends Error {

    constructor(
        message: string,
        public metricType?: ComposedMetricType<any>,
        public params?: ComposedMetricParams,
    ) {
        super(message);
    }

}

/**
 * Error thrown by composed metric implementations.
 */
 export class ComposedMetricMappingError extends ComposedMetricError {

    constructor(
        message: string,
        public mapping: ComposedMetricMapping,
        public metricType?: ComposedMetricType<any>,
        public params?: ComposedMetricParams,
    ) {
        super(message, metricType, params);
    }

}
