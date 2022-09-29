import { Injectable } from '@angular/core';
import { InstrumentationQualityService } from '@hypertrace/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { orgScoreResponse, serviceScoreResponse } from './service-instrumentation.fixture';
import { OrgScoreResponse, ServiceScoreResponse } from './service-instrumentation.types';

@Injectable()
export class ServiceInstrumentationService {
  public serviceScoreSubject: BehaviorSubject<ServiceScoreResponse | undefined> = new BehaviorSubject<
    ServiceScoreResponse | undefined
  >(undefined);

  public constructor(private readonly queryService: InstrumentationQualityService) {}

  public getServiceScore(
    serviceName: string,
    options: { mock: boolean } = { mock: false }
  ): Observable<ServiceScoreResponse> {
    if (options.mock) {
      return of({ ...serviceScoreResponse, serviceName: serviceName }).pipe(delay(1000));
    }

    return this.queryService.get<ServiceScoreResponse>(`/${serviceName}`);
  }

  public getOrgScore(options: { mock: boolean } = { mock: false }): Observable<OrgScoreResponse> {
    if (options.mock) {
      return of(orgScoreResponse);
    }

    return this.queryService.get<OrgScoreResponse>();
  }

  public getLabelForScore(score: number): string {
    if (score < 50) {
      return 'Below Average';
    }

    if (score < 70) {
      return 'Average';
    }

    if (score < 90) {
      return 'Above Average';
    }

    return 'Excellent!';
  }

  public getColorForScore(score: number): { light: string; dark: string } {
    // Shades taken from Radix Colors
    if (score < 50) {
      return {
        light: '#ffe5e5', // Red4
        dark: '#dc3d43' // Red10
      };
    }

    if (score < 70) {
      return {
        light: '#ffecbc', // Amber4
        dark: '#ffa01c' // Amber10
      };
    }

    return {
      light: '#dff3df', // Grass4
      dark: '#3d9a50' // Grass10
    };
  }

  public getDescriptionForScore(score: number): string {
    if (score < 50) {
      return 'Attention is needed to improve the instrumentation of this service so you can start gaining valuable insights from Hypertrace.';
    }

    if (score < 70) {
      return 'There is considerable scope for improvement. Please see the sections below to learn how to improve the instrumentation of this service.';
    }

    if (score < 90) {
      return 'This service has good instrumentation, but you can still make improvements to gain more valuable insights from Hypertrace.';
    }

    return 'Great job! This service has been instrumented using best practices.';
  }
}
