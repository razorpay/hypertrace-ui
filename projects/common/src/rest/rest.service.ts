import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
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

export const REST_URI = new InjectionToken<RestOptions>('REST_URI');

@Injectable({
  providedIn: 'root'
})
export class RestClientService {
  public BASE_URL: string;
  public constructor(private readonly http: HttpClient, @Inject(REST_URI) restOptions: RestOptions) {
    this.BASE_URL = restOptions.uri;
  }

  public get<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.get<T>(this.BASE_URL + endPoint, options);
  }

  public post<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.post<T>(this.BASE_URL + endPoint, options?.body, options);
  }

  public put<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.put<T>(this.BASE_URL + endPoint, options?.body, options);
  }

  public delete<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.delete<T>(this.BASE_URL + endPoint, options);
  }
}
