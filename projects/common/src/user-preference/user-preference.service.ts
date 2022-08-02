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

export const USER_PREFERENCE_URI = new InjectionToken<RestOptions>('USER_PREFERENCE_URI');

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  public BASE_URL: string;
  public constructor(private readonly http: HttpClient, @Inject(USER_PREFERENCE_URI) restOptions: RestOptions) {
    this.BASE_URL = restOptions.uri;
  }
  private addUserEmailHeader(headers?: HttpHeaders): HttpHeaders {
    if (headers) {
      return headers.append('user.email', 'shivam.rai@razorpay.com');
    }
    const requestHeaders = new HttpHeaders();

    return requestHeaders.append('user.email', 'shivam.rai@razorpay.com');
  }
  public get<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    const requestOptions = { ...options };
    requestOptions.headers = this.addUserEmailHeader(requestOptions.headers);

    return this.http.get<T>(this.BASE_URL + endPoint, requestOptions);
  }

  public post<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    const requestOptions = { ...options };
    requestOptions.headers = this.addUserEmailHeader(requestOptions.headers);

    return this.http.post<T>(this.BASE_URL + endPoint, options?.body, requestOptions);
  }

  public put<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    const requestOptions = { ...options };
    requestOptions.headers = this.addUserEmailHeader(requestOptions.headers);

    return this.http.put<T>(this.BASE_URL + endPoint, options?.body, requestOptions);
  }

  public delete<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    const requestOptions = { ...options };
    requestOptions.headers = this.addUserEmailHeader(requestOptions.headers);

    return this.http.delete<T>(this.BASE_URL + endPoint, requestOptions);
  }
}
