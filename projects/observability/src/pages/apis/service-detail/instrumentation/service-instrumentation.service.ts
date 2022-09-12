import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Todo: Temporary Mock
import { orgScoreResponse, serviceScoreResponse } from './service-instrumentation.fixture';
import { OrgScoreResponse, ServiceScoreResponse } from './service-instrumentation.types';

@Injectable()
export class ServiceInstrumentationService {
  public getServiceScore(serviceName: string): Observable<ServiceScoreResponse> {
    return of({ ...serviceScoreResponse, serviceName: serviceName });
  }

  public getOrgScore(): Observable<OrgScoreResponse> {
    return of(orgScoreResponse);
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
}
