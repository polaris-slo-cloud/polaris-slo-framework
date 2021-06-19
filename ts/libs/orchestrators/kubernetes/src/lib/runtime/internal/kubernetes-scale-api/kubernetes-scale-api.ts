import * as http from 'http';
import { KubeConfig, KubernetesObject, KubernetesObjectApi, ObjectSerializer, V1Scale } from '@kubernetes/client-node';
import * as request from 'request';

// When refactoring this for inclusion in @kubernetes/client-node, we need to
// extract the protected helper methods of KubernetesObjectApi either into a helper class
// or into a base class.

/**
 * Provides access to the Kubernetes `Scale` subresource.
 */
export class KubernetesScaleApi extends KubernetesObjectApi {

    static makeScaleApiClient(kc: KubeConfig): KubernetesScaleApi {
        const client = kc.makeApiClient(KubernetesScaleApi);
        client.setDefaultNamespace(kc);
        return client;
    }

    /**
     * Reads the `Scale` subresource of a scalable Kubernetes resource.
     *
     * @param spec Kubernetes resource spec
     * @param pretty If `true`, then the output is pretty printed.
     * @param options Optional headers to use in the request.
     * @return Promise containing the request response and the `V1Scale`.
     */
    async readScale(
        spec: KubernetesObject,
        pretty?: string,
        options: { headers: { [name: string]: string } } = { headers: {} },
    ): Promise<{ body: V1Scale; response: http.IncomingMessage }> {
        // verify required parameter 'spec' is not null or undefined
        if (spec === null || spec === undefined) {
            throw new Error('Required parameter spec was null or undefined when calling read.');
        }

        const localVarPath = await this.specUriPath(spec, 'read') + '/scale';
        const localVarQueryParameters: Record<string, any> = {};
        const localVarHeaderParams = this.generateHeaders(options.headers);

        if (pretty !== undefined) {
            localVarQueryParameters.pretty = ObjectSerializer.serialize(pretty, 'string');
        }

        const localVarRequestOptions: request.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        return this.requestPromise(localVarRequestOptions);
    }


    /**
     * Replace the `Scale` subresource of a scalable Kubernetes resource.
     *
     * @param spec The Kubernetes resource spec, on which to modify the scale.
     * @param scale The new scale object that should be set.
     * @param pretty If `true`, then the output is pretty printed.
     * @param dryRun When present, indicates that modifications should not be persisted. An invalid or unrecognized
     *        dryRun directive will result in an error response and no further processing of the request. Valid values
     *        are: - All: all dry run stages will be processed
     * @param fieldManager fieldManager is a name associated with the actor or entity that is making these changes. The
     *        value must be less than or 128 characters long, and only contain printable characters, as defined by
     *        https://golang.org/pkg/unicode/#IsPrint.
     * @param options Optional headers to use in the request.
     * @return Promise containing the request response and [[KubernetesObject]].
     */
    async replaceScale(
        spec: KubernetesObject,
        scale: V1Scale,
        pretty?: string,
        dryRun?: string,
        fieldManager?: string,
        options: { headers: { [name: string]: string } } = { headers: {} },
    ): Promise<{ body: KubernetesObject; response: http.IncomingMessage }> {
        // verify required parameter 'spec' is not null or undefined
        if (spec === null || spec === undefined) {
            throw new Error('Required parameter spec was null or undefined when calling replace.');
        }

        const localVarPath = await this.specUriPath(spec, 'replace') + '/scale';
        const localVarQueryParameters: Record<string, any> = {};
        const localVarHeaderParams = this.generateHeaders(options.headers);

        if (pretty !== undefined) {
            localVarQueryParameters.pretty = ObjectSerializer.serialize(pretty, 'string');
        }

        if (dryRun !== undefined) {
            localVarQueryParameters.dryRun = ObjectSerializer.serialize(dryRun, 'string');
        }

        if (fieldManager !== undefined) {
            localVarQueryParameters.fieldManager = ObjectSerializer.serialize(fieldManager, 'string');
        }

        const localVarRequestOptions: request.Options = {
            method: 'PUT',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(scale, 'KubernetesObject'),
        };

        return this.requestPromise(localVarRequestOptions);
    }

}
