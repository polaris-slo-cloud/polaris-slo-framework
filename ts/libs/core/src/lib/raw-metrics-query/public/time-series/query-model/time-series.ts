import { DataType } from '../../generic/data-types';
import { Sample } from './sample';

/**
 * Represents a sequence of measurements, i.e., `samples`, of a single metric.
 *
 * The samples begin at the time denoted by `start` and are ordered chronologically until
 * the time denoted by `end`.
 *
 * @param T The TypeScript type used to represent the data in the samples.
 */
export interface TimeSeries<T> {

    /**
     * The name of the metric that is recorded in this TimeSeries.
     */
    metricName: string;

    /**
     * Map of labels and their values (e.g., method='POST', node='node0')
     */
    labels: Record<string, string>;

    /**
     * The length of the interval (in milliseconds) between two adjacent the samples.
     */
    recordingIntervalMs?: number;

    /** Unix timestamp in milliseconds precision of the first sample of the TimeSeries. */
    start: number;

    /** Unix timestamp in milliseconds precision of the last sample of the TimeSeries. */
    end: number;

    /** The type of data stored by the samples in this TimeSeries. */
    dataType: DataType;

    /**
     * The samples contained in this TimeSeries.
     */
    samples: Sample<T>[];

}

/**
 * Represents a `TimeSeries` with only a single sample.
 *
 * @param T The TypeScript type used to represent the data in the sample.
 */
export interface TimeSeriesInstant<T> extends TimeSeries<T> {

    /**
     * The samples contained in this TimeSeries.
     *
     * @note A `TimeSeriesInstant` contains by definition only a single sample.
     */
    samples: [ Sample<T> ]

}
