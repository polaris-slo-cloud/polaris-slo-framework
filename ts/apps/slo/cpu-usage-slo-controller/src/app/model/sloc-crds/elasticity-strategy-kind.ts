
/**
 * References a particular kind of ElasticityStrategy that should be used by an SloMapping.
 */
export interface ElasticityStrategyKind {

    /** The API group and version of the ElasticityStrategy. */
    apiVersion: string;

    /** The kind of ElasticityStrategy. */
    kind: string;

}
