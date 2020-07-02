import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IndexByKey } from '../../../common';

export type HttpHeadersMap = IndexByKey<string | string[]>;

/**
 * Provides an abstraction for accessing JSON REST APIs.
 *
 * Don't use `HttpClient` directly, use the `HttpService` to get an instance of `HttpRestClient` instead.
 *
 * ToDo: Add automatic error handling.
 */
export interface HttpRestClient {

    /** Headers used for making HTTP requests with this client. */
    httpHeaders: HttpHeaders;

    /** The base URL that is prepended to every request's path. */
    readonly baseUrl: string;

    get<T>(url: string, params?: any): Observable<T>;

    post<T>(url: string, body: any, params?: any): Observable<T>;

    put<T>(url: string, body: any, params?: any): Observable<T>;

    delete<T>(url: string, params?: any): Observable<T>;

}
