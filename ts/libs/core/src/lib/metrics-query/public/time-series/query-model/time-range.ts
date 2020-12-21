
/**
 * Defines a range in time beginning at `start` and stopping at `end` (both inclusive).
 */
export class TimeRange {

    /** The Unix timestamp in milliseconds precision when this time range starts (inclusive). */
    start: number;

    /** The Unix timestamp in milliseconds precision when this time range ends (inclusive). */
    end: number;

    /**
     * Creates a new `TimeRange` with the values:
     * - `start = now - duration`
     * - `end = now`
     */
    static fromDuration(duration: Duration): TimeRange {
        const end = new Date().valueOf();
        const start = end - duration.valueMs;
        return new TimeRange(start, end);
    }

    /**
     * Creates a new `TimeRange` with the values:
     * - `start = now - offset - duration`
     * - `end = now - offset`
     */
    static fromDurationWithOffset(offset: Duration, duration: Duration): TimeRange {
        const end = new Date().valueOf() - offset.valueMs;
        const start = end - duration.valueMs;
        return new TimeRange(start, end);
    }

    /**
     * Creates a new `TimeRange` with the specified `start` and `end` values.
     */
    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
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
