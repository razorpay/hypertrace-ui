import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { TimeRange } from '../public-api';

import { Observable } from 'rxjs';

import { DeploymentsResponse } from './deployment.types';

interface TokenOptions {
  uri: string;
}

export const DEPLOYMENT_SERVICE_OPTIONS = new InjectionToken<TokenOptions>('DEPLOYMENT_SERVICE_OPTIONS');

@Injectable({ providedIn: 'root' })
export class DeploymentsService {
  public BASE_URL: string;
  public ENDPOINT: string = '/v1/deploy/';

  public constructor(
    private readonly http: HttpClient,
    @Inject(DEPLOYMENT_SERVICE_OPTIONS) injectedOptions: TokenOptions
  ) {
    this.BASE_URL = injectedOptions.uri;
  }

  public getAllServiceDeployments(serviceName: string, timeRange: TimeRange): Observable<DeploymentsResponse> {
    const params = new HttpParams().appendAll({
      service: serviceName,
      startTime: timeRange.startTime.getTime(),
      endTime: timeRange.endTime.getTime()
    });

    return this.http.get<DeploymentsResponse>(`${this.BASE_URL}${this.ENDPOINT}`, {
      params: params
    });
  }
}
