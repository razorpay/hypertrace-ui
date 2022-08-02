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
  private static readonly BASE_URL_CONFIG_KEY: string = 'user-preference';
  public constructor(
    private readonly http: HttpClient,
    private readonly dynamicConfigurationService: DynamicConfigurationService
  ) {
    this.BASE_URL = this.dynamicConfigurationService.getValueForUrlConfig(
      UserPreferenceService.BASE_URL_CONFIG_KEY
    ) as string;
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

// tslint:disable-next-line: max-classes-per-file
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // tslint:disable-next-line: ban-ts-ignore
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      return next.handle(httpRequest.clone({ setHeaders: { 'user.email': 'shivam.rai@razorpay.com' } }));
    }

    return next.handle(httpRequest);
  }
}
