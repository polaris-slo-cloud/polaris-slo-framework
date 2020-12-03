import { IndexByKey } from '../../../util';
import { DataType, DataTypeMappings } from './data-types';
import { Sample } from './sample';

/**
 * Represents a sequence of measurements, i.e., `samples`, of a single metric.
 *
 * The samples begin at the time denoted by `start` and are ordered chronologically until
 * the time denoted by `end`.
 *
 * @param D The name of the data type that is stored in the samples.
 * @param T The TypeScript type used to represent the data in the samples.
 *
 * @note The default value of `T` is determined by the selected `DataType`, but may be overriden if necessary,
 * e.g., if `DataType.Object` is used, a specifict interface may be used as `T`.
 */
export interface TimeSeries<D extends DataType, T = DataTypeMappings[D]> {

    /**
     * The name of the metric that is recorded in this TimeSeries.
     */
    metricName: string;

    /**
     * Map of labels and their values (e.g., method='POST', node='node0')
     */
    labels: IndexByKey<string>;

    /**
     * The length of the interval (in milliseconds) between two adjacent the samples.
     */
    recordingIntervalMs?: number;

    /** Unix timestamp in milliseconds precision of the first sample of the TimeSeries. */
    start: number;

    /** Unix timestamp in milliseconds precision of the last sample of the TimeSeries. */
    end: number;

    /** The type of data stored by the samples in this TimeSeries. */
    dataType: D;

    /**
     * The samples contained in this TimeSeries.
     */
    samples: Sample<T>[];

}

/**
 * Represents a `TimeSeries` with only a single sample.
 */
export interface TimeSeriesInstant<D extends DataType, T = DataTypeMappings[D]> extends TimeSeries<D, T> {

    samples: [ Sample<T> ]

}
