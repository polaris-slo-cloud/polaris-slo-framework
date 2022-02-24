import { QueryError } from '../../../generic';
import {
    JoinConfig,
    LabelGroupingConfig,
    TimeInstantQuery,
    TimeSeriesInstant,
    TimeSeriesQueryResultType,
    ValueFilter,
    isTimeSeriesQuery,
} from '../../query-model';
import { BinaryOperator } from '../binary-operator';
import {
    BinaryOperationQueryContent,
    BinaryOperationWithConstOperandQueryContent,
    FilterOnValueQueryContent,
    QueryContentType,
    createQueryContent,
} from '../query-content';
import { TimeSeriesQueryBase } from './time-series-query.base';

/**
 * This class contains the implementation of all methods defined by the `TimeInstantQuery` interface.
 *
 * It does not contain implementations for the two abstract factory methods for new queries defined
 * in `TimeSeriesQueryBase`, because that would create a circular dependency between this file and the one
 * containing the `TimeRangeQuery` implementation. The classes implementing these methods are contained
 * in a single file (time-series-queries.impl.ts`).
 */
export abstract class TimeInstantQueryBase<T> extends TimeSeriesQueryBase<TimeSeriesInstant<T>> implements TimeInstantQuery<T> {

    readonly resultType: TimeSeriesQueryResultType.Instant = TimeSeriesQueryResultType.Instant;

    abs(): TimeInstantQuery<T> {
        throw new Error('Method not implemented.');
    }

    add(addend: T | TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T> {
        const queryContent = this.createBinaryOperationQueryContent(BinaryOperator.Add, addend, joinConfig);
        return this.createTimeInstantQuery(queryContent);
    }

    subtract(subtrahend: T | TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T> {
        const queryContent = this.createBinaryOperationQueryContent(BinaryOperator.Subtract, subtrahend, joinConfig);
        return this.createTimeInstantQuery(queryContent);
    }

    multiplyBy(factor: T | TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T> {
        const queryContent = this.createBinaryOperationQueryContent(BinaryOperator.Multiply, factor, joinConfig);
        return this.createTimeInstantQuery(queryContent);
    }

    divideBy(divisor: T | TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T> {
        const queryContent = this.createBinaryOperationQueryContent(BinaryOperator.Divide, divisor, joinConfig);
        return this.createTimeInstantQuery(queryContent);
    }

    modulo(divisor: T | TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T> {
        const queryContent = this.createBinaryOperationQueryContent(BinaryOperator.Modulo, divisor, joinConfig);
        return this.createTimeInstantQuery(queryContent);
    }

    pow(exponent: T | TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T> {
        const queryContent = this.createBinaryOperationQueryContent(BinaryOperator.Power, exponent, joinConfig);
        return this.createTimeInstantQuery(queryContent);
    }

    union(other: TimeInstantQuery<T>): TimeInstantQuery<T> {
        const queryContent = createQueryContent(
            QueryContentType.BinaryOperation,
            {
                operator: BinaryOperator.Union,
                subqueries: [ other ],
            },
        );
        return this.createTimeInstantQuery(queryContent);
    }

    intersect(other: TimeInstantQuery<T>): TimeInstantQuery<T> {
        const queryContent = createQueryContent(
            QueryContentType.BinaryOperation,
            {
                operator: BinaryOperator.Intersection,
                subqueries: [ other ],
            },
        );
        return this.createTimeInstantQuery(queryContent);
    }

    complementOf(other: TimeInstantQuery<T>): TimeInstantQuery<T> {
        const queryContent = createQueryContent(
            QueryContentType.BinaryOperation,
            {
                operator: BinaryOperator.Complement,
                subqueries: [ other ],
            },
        );
        return this.createTimeInstantQuery(queryContent);
    }

    sumByGroup(groupingConfig?: LabelGroupingConfig): TimeInstantQuery<number> {
        const queryContent = createQueryContent(
            QueryContentType.AggregateByGroup,
            {
                aggregationType: 'sum',
                groupingConfig,
            },
        );
        return this.createTimeInstantQuery(queryContent);
    }

    averageByGroup(groupingConfig?: LabelGroupingConfig): TimeInstantQuery<number> {
        const queryContent = createQueryContent(
            QueryContentType.AggregateByGroup,
            {
                aggregationType: 'avg',
                groupingConfig,
            },
        );
        return this.createTimeInstantQuery(queryContent);
    }

    minByGroup(groupingConfig?: LabelGroupingConfig): TimeInstantQuery<number> {
        const queryContent = createQueryContent(
            QueryContentType.AggregateByGroup,
            {
                aggregationType: 'min',
                groupingConfig,
            },
        );
        return this.createTimeInstantQuery(queryContent);
    }

    maxByGroup(groupingConfig?: LabelGroupingConfig): TimeInstantQuery<number> {
        const queryContent = createQueryContent(
            QueryContentType.AggregateByGroup,
            {
                aggregationType: 'max',
                groupingConfig,
            },
        );
        return this.createTimeInstantQuery(queryContent);
    }

    filterOnValue(predicate: ValueFilter): TimeInstantQuery<T> {
        const queryContent: FilterOnValueQueryContent = {
            contentType: QueryContentType.FilterOnValue,
            filter: predicate,
        };
        return this.createTimeInstantQuery(queryContent);
    }

    protected createBinaryOperationQueryContent(
        operator: BinaryOperator,
        rightOperand: T | TimeInstantQuery<T>,
        joinConfig?: JoinConfig,
    ): BinaryOperationQueryContent | BinaryOperationWithConstOperandQueryContent {
        if (isTimeSeriesQuery(rightOperand)) {
            if (!(rightOperand instanceof TimeSeriesQueryBase)) {
                throw new QueryError(
                    `Right operand of binary query operation '${operator}' must have been created by the same TimeSeriesSource as the left operand.`,
                    rightOperand,
                );
            }

            return createQueryContent(
                QueryContentType.BinaryOperation,
                {
                    operator,
                    subqueries: [ rightOperand ],
                    joinConfig,
                },
            );
        } else {
            return createQueryContent(
                QueryContentType.BinaryOperationWithConstant,
                {
                    operator,
                    rightOperand,
                },
            );
        }
    }

}
