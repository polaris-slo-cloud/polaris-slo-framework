/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Constructor, ContainerResources, JsonSchema, PolarisTransformationService, ReusablePolarisTransformer } from '@polaris-sloc/core';
import { KubernetesQuantity, KubernetesResourceRequirements, KubernetesResourcesList } from '../../../model';

/**
 * Transforms `ContainerResources` to Kubernetes-native resource requirement objects.
 *
 * **PolarisTransformer info:**
 * - **Inheritable**: Yes
 * - **Reusable in other transformers**: Yes
 * - **Handled orchestrator object properties**:
 *      - `cpu`
 *      - `memory`
 * - **Unknown property handling**: Copies unknown properties.
 */
export class ContainerResourcesTransformer implements ReusablePolarisTransformer<ContainerResources, KubernetesResourceRequirements> {

    extractPolarisObjectInitData(
        polarisType: Constructor<ContainerResources>,
        orchPlainObj: KubernetesResourceRequirements,
        transformationService: PolarisTransformationService,
    ): Partial<ContainerResources> {
        const { cpu, memory, ...other } = this.mergeIntoSingleResourceList(orchPlainObj);
        const data: Partial<ContainerResources> = other as any;

        if (cpu) {
            const cpuQuantity = KubernetesQuantity.fromString(cpu);
            data.milliCpu = cpuQuantity.valueMilli;
        }
        if (memory) {
            const memoryQuantity = KubernetesQuantity.fromString(memory);
            data.memoryMiB = memoryQuantity.valueMiB;
        }
        return data;
    }

    transformToPolarisObject(
        polarisType: Constructor<ContainerResources>,
        orchPlainObj: KubernetesResourceRequirements,
        transformationService: PolarisTransformationService,
    ): ContainerResources {
        const data = this.extractPolarisObjectInitData(polarisType, orchPlainObj, transformationService);
        // Using `new polarisType()` allows this transformer to work also for subclasses.
        return new polarisType(data);
    }

    transformToOrchestratorPlainObject(polarisObj: ContainerResources, transformationService: PolarisTransformationService): KubernetesResourceRequirements {
        const { milliCpu, memoryMiB, ...other } = polarisObj;

        const k8sResources: KubernetesResourcesList = {
            cpu: milliCpu ? `${milliCpu}m` : undefined,
            memory: memoryMiB ? `${memoryMiB}Mi` : undefined,
            ...other,
        };

        return {
            limits: k8sResources,
            requests: { ...k8sResources },
        };
    }

    /**
     * @returns A schema that is essentially a copy of the one for Kubernetes `ResourceRequirements`
     * (https://pkg.go.dev/k8s.io/api/core/v1#ResourceRequirements ).
     */
    transformToOrchestratorSchema(
        polarisSchema: JsonSchema<ContainerResources>,
        polarisType: Constructor<ContainerResources>,
        transformationService: PolarisTransformationService,
    ): JsonSchema<KubernetesResourceRequirements> {
        const resourcesListSchema: JsonSchema = {
            type: 'object',
            additionalProperties: {
                anyOf: [
                    { type: 'integer' },
                    { type: 'string' },
                ],
                pattern: '^(\+|-)?(([0-9]+(\.[0-9]*)?)|(\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\+|-)?(([0-9]+(\.[0-9]*)?)|(\.[0-9]+))))?$',
            },
        };
        (resourcesListSchema.additionalProperties as any)['x-kubernetes-int-or-string'] = true;

        return {
            type: 'object',
            description: 'Compute Resources required by this container. ' +
                'Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/',
            properties: {
                limits: {
                    ...resourcesListSchema,
                    description: 'Limits describes the maximum amount of compute resources allowed. ' +
                        'More info: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/',
                },
                requests: {
                    ...resourcesListSchema,
                    description: 'Requests describes the minimum amount ' +
                        'of compute resources required. If Requests is omitted ' +
                        'for a container, it defaults to Limits if that is ' +
                        'explicitly specified, otherwise to an implementation-defined ' +
                        'value. More info: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/',
                },
            },
        };
    }

    private mergeIntoSingleResourceList(requirements: KubernetesResourceRequirements): KubernetesResourcesList {
        const limits: any = requirements.limits ? { ...requirements.limits } : {};
        if (!requirements.requests) {
            return limits;
        }
        const requests: any = requirements.requests;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.keys(requests).forEach(key => {
            if (limits[key] === undefined) {
                limits[key] = requests[key];
            }
        });
        return limits;
    }

}
