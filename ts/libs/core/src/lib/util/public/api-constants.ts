/* eslint-disable @typescript-eslint/naming-convention */

/** Commonly used constants for the Polaris API. */
export const POLARIS_API = Object.freeze({

    /** Base domain of all Polaris API groups. */
    POLARIS_BASE: 'polaris-slo-cloud.github.io',

    /** The name of the default Polaris elasticity strategy API group. */
    ELASTICITY_GROUP: 'elasticity.polaris-slo-cloud.github.io',

    /** The name of the default Polaris metrics API group. */
    METRICS_GROUP: 'metrics.polaris-slo-cloud.github.io',

    /** The name of the default Polaris SLOs API group. */
    SLO_GROUP: 'slo.polaris-slo-cloud.github.io',

    /** Used for storing the owner of an `ApiObject` as a queryable label. */
    LABEL_OWNER_API_GROUP: 'polaris-slo-cloud.github.io/owner-api-group',

    /** Used for storing the owner of an `ApiObject` as a queryable label. */
    LABEL_OWNER_API_VERSION: 'polaris-slo-cloud.github.io/owner-api-version',

    /** Used for storing the owner of an `ApiObject` as a queryable label. */
    LABEL_OWNER_KIND: 'polaris-slo-cloud.github.io/owner-kind',

    /** Used for storing the owner of an `ApiObject` as a queryable label. */
    LABEL_OWNER_NAME: 'polaris-slo-cloud.github.io/owner-name',

    /** Used for storing the Polaris schema generator version in a CRD. */
    ANNOTATION_CRD_GENERATOR_VERSION: 'polaris-slo-cloud.github.io/schema-gen-version',

});
