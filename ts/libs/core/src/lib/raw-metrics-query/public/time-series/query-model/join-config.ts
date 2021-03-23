import { LabelGroupingConfig, LabelGroupingOrJoinType } from './label-grouping-config';

/**
 * Describes an extended join configuration.
 *
 * Use the static methods of the `Join` class to create objects that conform to this interface.
 */
export interface JoinConfig extends LabelGroupingConfig {

    /** Optional configuration for one-to-many and many-to-one joins. */
    grouping?: JoinGrouping;

    /** Optional list of additional labels from the one side on one-to-many and many-to-one joins. */
    additionalLabelsFromOneSide?: string[];

}

/**
 * Determines to determine which side is the many side in one-to-many and many-to-one join operations
 */
// eslint-disable-next-line no-shadow
export enum JoinGrouping {

    /** The left side is the `many` side. */
    Left = 'groupLeft',

    /** The right side is the `many` side. */
    Right = 'groupRight',

}

/**
 * Helper class for configuring `JoinConfig` objects.
 */
export class Join implements JoinConfig {

    labelUsageType: LabelGroupingOrJoinType;
    labels?: string[];

    /**
     * Creates a new `Join` configuration where the join will occur on the specified `labels`.
     *
     * The returned object supports further configuration through the `groupLeft()` and `groupRight()` methods.
     *
     * @param labels The labels to join on.
     */
    static onLabels(...labels: string[]): Join {
        return new Join(labels, LabelGroupingOrJoinType.ByOrOn);
    }

    /**
     * Creates a new `Join` configuration where the join will occur on the all labels, except for the specified `labels`.
     *
     * The returned object supports further configuration through the `groupLeft()` and `groupRight()` methods.
     *
     * @param labels The labels to exclude from the join operation.
     */
    static ignoringLabels(...labels: string[]): Join {
        return new Join(labels, LabelGroupingOrJoinType.Without);
    }

    /**
     * Configures a many-to-one join, i.e., the left side is the `many` side, without any on/ignoring part.
     *
     * @param additionalLabelsFromRightSide (optional) Additional labels from the right side that should be considered.
     */
    static groupLeft(...additionalLabelsFromRightSide: string[]): JoinConfig {
        return {
            labelUsageType: LabelGroupingOrJoinType.ByOrOn,
            grouping: JoinGrouping.Left,
            additionalLabelsFromOneSide: additionalLabelsFromRightSide,
        };
    }

    /**
     * Configures a one-to-many join, i.e., the right side is the `many` side, without any on/ignoring part.
     *
     * @param additionalLabelsFromLeftSide (optional) Additional labels from the left side that should be considered.
     */
    static groupRight(...additionalLabelsFromLeftSide: string[]): JoinConfig {
        return {
            labelUsageType: LabelGroupingOrJoinType.ByOrOn,
            grouping: JoinGrouping.Right,
            additionalLabelsFromOneSide: additionalLabelsFromLeftSide,
        };
    }

    protected constructor(labels: string[], labelUsageType: LabelGroupingOrJoinType) {
        this.labels = labels;
        this.labelUsageType = labelUsageType;
    }

    /**
     * Configures a many-to-one join, i.e., the left side is the `many` side.
     *
     * @param additionalLabelsFromRightSide (optional) Additional labels from the right side that should be considered.
     */
    groupLeft(...additionalLabelsFromRightSide: string[]): JoinConfig {
        return {
            labels: this.labels,
            labelUsageType: this.labelUsageType,
            grouping: JoinGrouping.Left,
            additionalLabelsFromOneSide: additionalLabelsFromRightSide,
        };
    }

    /**
     * Configures a one-to-many join, i.e., the right side is the `many` side.
     *
     * @param additionalLabelsFromLeftSide (optional) Additional labels from the left side that should be considered.
     */
     groupRight(...additionalLabelsFromLeftSide: string[]): JoinConfig {
        return {
            labels: this.labels,
            labelUsageType: this.labelUsageType,
            grouping: JoinGrouping.Right,
            additionalLabelsFromOneSide: additionalLabelsFromLeftSide,
        };
    }

}
