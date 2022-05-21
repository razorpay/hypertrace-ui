import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

interface RestOptions {
  uri: string;
}
export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: object;
}

export const REST_OPTIONS = new InjectionToken<RestOptions>('REST_OPTIONS');

@Injectable({
  providedIn: 'root'
})
export class RestClientService {
  public BASE_URL: string;
  public constructor(private readonly http: HttpClient, @Inject(REST_OPTIONS) restOptions: RestOptions) {
    this.BASE_URL = restOptions.uri;
  }

  public Get<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.get<T>(this.BASE_URL + endPoint, options);
  }

  public Post<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.post<T>(this.BASE_URL + endPoint, options?.body, options);
  }

  public Put<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.put<T>(this.BASE_URL + endPoint, options?.body, options);
  }

  public Delete<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.delete<T>(this.BASE_URL + endPoint, options);
  }
}
