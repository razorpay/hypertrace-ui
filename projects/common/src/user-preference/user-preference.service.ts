import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicConfigurationService } from '../dynamic-configuration/dynamic-configuration.service';

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
  private static readonly BASE_URL_CONFIG_KEY: string = 'user_preference';
  public constructor(
    private readonly http: HttpClient,
    private readonly dynamicConfigurationService: DynamicConfigurationService
  ) {
    this.BASE_URL = this.dynamicConfigurationService.getValueForUrlConfig(
      UserPreferenceService.BASE_URL_CONFIG_KEY
    ) as string;
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
