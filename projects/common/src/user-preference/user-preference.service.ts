import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
interface TokenOptions {
  uri: string;
}
export const USER_PREFERENCES_OPTIONS = new InjectionToken<TokenOptions>('USER_PREFERENCE_OPTIONS');

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: object;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  public BASE_URL: string;
  public constructor(private readonly http: HttpClient, @Inject(USER_PREFERENCES_OPTIONS) tokenOptions: TokenOptions) {
    this.BASE_URL = tokenOptions.uri;
  }
  private addUserEmailHeader(headers?: HttpHeaders): HttpHeaders {
    if (headers) {
      // TODO Read email form email service later
      return headers.append('user.email', 'ht-user@razorpay.com');
    }
    const requestHeaders = new HttpHeaders();

    return requestHeaders.append('user.email', 'ht-user@razorpay.com');
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
