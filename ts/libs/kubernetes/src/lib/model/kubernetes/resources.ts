
export interface KubernetesResourcesList {

    cpu?: string;
    memory?: string;
    storage?: string;
    'ephemeral-storage'?: string;
}

/**
 * Typed version of `V1ResourceRequirements`,
 */
export interface KubernetesResourceRequirements {

    limits?: KubernetesResourcesList;
    requests?: KubernetesResourcesList;

}
