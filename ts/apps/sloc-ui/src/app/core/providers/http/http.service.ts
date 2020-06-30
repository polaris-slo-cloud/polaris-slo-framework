import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

/**
 * Options used in HTTP requests.
 *
 * Copied from method definitions in https://github.com/angular/angular/blob/master/packages/common/http/src/client.ts
 */
interface HttpOptions {
    body?: any,
    headers?: HttpHeaders,
    params?: HttpParams,
    observe: 'response',
    reportProgress?: boolean,
    responseType: 'json',
    withCredentials?: boolean,
}

/**
 * Provides an abstraction for accesing JSON REST APIs.
 *
 * Don't use `HttpClient` directly, use this service instead.
 *
 * ToDo: Add automatic error handling.
 */
@Injectable()
export class HttpService {

    constructor(
        private http: HttpClient,
    ) { }

    get<T>(url: string, params: any = {}): Observable<T> {
        const options = this.assembleHttpOptions(params);

        return this.http.get<T>(url, options).pipe(
            map(res => res.body),
        );
    }

    post<T>(url: string, body: any, params: any = {}): Observable<T> {
        const bodyJSON = typeof body === 'string' ? body : JSON.stringify(body);
        const options = this.assembleHttpOptions(params);

        return this.http.post<T>(url, bodyJSON, options).pipe(
            map(res => res.body),
        );
    }

    put<T>(url: string, body: any, params: any = {}): Observable<T> {
        const bodyJSON = typeof body === 'string' ? body : JSON.stringify(body);
        const options = this.assembleHttpOptions(params);

        return this.http.put<T>(url, bodyJSON, options).pipe(
            map(res => res.body),
        );
    }

    delete<T>(url: string, params: any = {}): Observable<T> {
        const options = this.assembleHttpOptions(params);

        return this.http.delete<T>(url, options).pipe(
            map(res => {
                // If the status code is 200, the response has a body (T is not void), otherwise it doesn't have a body (T is void).
                return res.status === 200 ? res.body : undefined;
            }),
        );
    }

    private assembleHttpOptions(params: any): HttpOptions {
        const options = this.getDefaultOptions();
        options.params = new HttpParams({ fromObject: params });
        return options;
    }

    private getDefaultOptions(): HttpOptions {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
            observe: 'response',
            responseType: 'json',
        };
    }

}
