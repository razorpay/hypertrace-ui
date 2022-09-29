import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

interface TokenOptions {
  uri: string;
}
export const INSTRUMENTATION_QUALITY_OPTIONS = new InjectionToken<TokenOptions>('INSTRUMENTATION_QUALITY_OPTIONS');

@Injectable({
  providedIn: 'root'
})
export class InstrumentationQualityService {
  public BASE_URL: string;

  public constructor(
    private readonly http: HttpClient,
    @Inject(INSTRUMENTATION_QUALITY_OPTIONS) tokenOptions: TokenOptions
  ) {
    this.BASE_URL = tokenOptions.uri;
  }

  public get<T>(endPoint: string = ''): Observable<T> {
    return this.http.get<T>(this.BASE_URL + endPoint);
  }
}
