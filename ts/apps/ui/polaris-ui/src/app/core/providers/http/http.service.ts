import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpHeadersMap, HttpRestClient } from './http-rest-client';
import { HttpRestClientImpl } from './http-rest-client.impl';

/**
 * Provides a means of obtaining `HttpRestClient` objects.
 */
@Injectable()
export class HttpService {

    constructor(
        private http: HttpClient,
    ) { }

    createHttpRestClient(baseUrl: string, httpHeaders?: HttpHeadersMap): HttpRestClient {
        return new HttpRestClientImpl(this.http, baseUrl, httpHeaders ?? this.getDefaultHttpHeadersMap());
    }

    private getDefaultHttpHeadersMap(): HttpHeadersMap {
        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Accept: 'application/json',
        };
    }

}
