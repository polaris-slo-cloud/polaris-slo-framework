
/**
 * Defines a range in time that may be
 * - fixed, i.e., `start` and `end` are absolute timestamps (both inclusive), or
 * - dynamic, i.e., `end` is always `now()` or `now() - offset`.
 */
export class TimeRange {

    /** The duration of this time range. */
    readonly duration: Duration

    /** The offset from `now()` if this time range has a dynamic offset. */
    readonly offset?: Duration

    /**
     * The end timestamp.
     *
     * - If this is a positive integer, it is a fixed end timestamp for the time range.
     * - If this is `undefined` and `offset` is also `undefined, the time range always ends `now()`.
     * - If this is `undefined` and `offset` is set, the time range ends at `now() - offset`.
     */
    private endTimestamp?: number;

    /**
     * The Unix timestamp in milliseconds precision when this time range starts (inclusive).
     *
     * This value is computed using `end` and `duration`.
     */
    get start(): number {
        return this.end - this.duration.valueMs;
    }

    /**
     * The Unix timestamp in milliseconds precision when this time range ends (inclusive)
     */
    get end(): number {
        return this.endTimestamp ?? new Date().valueOf();
    }

    /**
     * Creates a new `TimeRange` with the dynamic values:
     * - `start = now() - duration`
     * - `end = now()`
     */
    static fromDuration(duration: Duration): TimeRange {
        return new TimeRange(duration);
    }

    /**
     * Creates a new `TimeRange` with the dynamic values:
     * - `start = end() - duration`
     * - `end = now() - offset`
     */
    static fromDurationWithOffset(offset: Duration, duration: Duration): TimeRange {
        const end = new Date().valueOf() - offset.valueMs;
        return new TimeRange(duration, end);
    }

    /**
     * Creates a new `TimeRange` with the specified `duration` that always ends `now()`.
     *
     * @param duration The `Duration` of this time range.
     */
    constructor(duration: Duration)
    /**
     * Creates a new `TimeRange` with the specified `duration` that always ends `now() - offset`.
     *
     * @param duration The `Duration` of this time range.
     * @param offset The offset from `now()`, at which this time range should end.
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    constructor(duration: Duration, offset: Duration)
    /**
     * Creates a new `TimeRange` with the specified `duration` and a fixed `end` timestamp.
     *
     * @param duration The `Duration` of this time range.
     * @param end The Unix timestamp, at which the time range ends (inclusive).
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    constructor(duration: Duration, end: number)
    constructor(duration: Duration, endOrOffset?: number | Duration) {
        this.duration = duration;

        switch (typeof endOrOffset) {
            case 'number':
                // TimeRange has a fixed end.
                this.endTimestamp = endOrOffset;
                break;
            case 'object':
                // TimeRange has a dynamic end: now() - offset.
                if (endOrOffset) {
                    this.offset = endOrOffset;
                }
                break;
            default:
                // TimeRange has a dynamic end: now()
                break;
        }
    }

    /**
     * @returns `true` if this time range always ends `now()`, i.e., at the time it is evaluated,
     * otherwise `false`.
     */
    endsNow(): boolean {
        return this.endTimestamp === undefined || this.endTimestamp === null;
    }

}

/**
 * Defines a time duration with millisecond precision.
 */
export class Duration {

    /** The duration in milliseconds. */
    readonly valueMs: number;

    static fromHours(hours: number): Duration {
        const ms = hours * 60 * 60 * 1000;
        return new Duration(ms);
    }

    static fromMinutes(minutes: number): Duration {
        const ms = minutes * 60 * 1000;
        return new Duration(ms);
    }

    static fromSeconds(seconds: number): Duration {
        const ms = seconds * 1000;
        return new Duration(ms);
    }

    static fromMilliseconds(ms: number): Duration {
        return new Duration(ms);
    }

    protected constructor(valueMs: number) {
        this.valueMs = valueMs;
    }

}
