
/**
 * Defines how a list of labels should be used for grouping.
 */
// eslint-disable-next-line no-shadow
export enum LabelGroupingOrJoinType {

    /**
     * The grouping/join should be done only by/on the specified list of labels.
     */
    ByOrOn = 'by',

    /**
     * The grouping/join should be done with/on all labels, except for the specified ones.
     */
    Without = 'without',

}

/**
 * Represents a grouping/join configuration for queries that support grouping/joining on labels.
 */
export interface LabelGroupingConfig {

    /**
     * Defines how the `labels` should be used for grouping/joining.
     *
     * If no value is specified, `LabelGroupingOrJoinType.ByOrOn` should be used as the default.
     */
    labelUsageType: LabelGroupingOrJoinType;

    /** The list of labels to be used for grouping/joining or to be excluded from grouping/joining (depending on `groupingType`). */
    labels?: string[];

}

/**
 * Helper class for creating `LabelGroupingConfig` objects.
 */
export class LabelGrouping {

    /**
     * Creates a `LabelGroupingConfig` that groups on the specified `labels`.
     *
     * @param labels The labels to group on. If none are specified, the grouping is performed on all labels.
     */
    static by(...labels: string[]): LabelGroupingConfig {
        return {
            labelUsageType: LabelGroupingOrJoinType.ByOrOn,
            labels,
        }
    }

    /**
     * Creates a `LabelGroupingConfig` that groups on all labels, except for the specified `labels`.
     *
     * @param labels The labels to exclude from grouping. If none are specified, the grouping is performed on all labels.
     */
     static without(...labels: string[]): LabelGroupingConfig {
        return {
            labelUsageType: LabelGroupingOrJoinType.Without,
            labels,
        }
    }

}
