import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Todo: Temporary Mock
import { buScoreResponse, orgScoreResponse, serviceScoreResponse } from './service-instrumentation.fixture';
import { BuScoreResponse, OrgScoreResponse, ServiceScoreResponse } from './service-instrumentation.types';

@Injectable()
export class ServiceInstrumentationService {
  public getServiceScore(serviceName: string): Observable<ServiceScoreResponse> {
    return of({ ...serviceScoreResponse, serviceName: serviceName });
  }

  public getBuScore(): Observable<BuScoreResponse> {
    return of(buScoreResponse);
  }

  public getOrgScore(): Observable<OrgScoreResponse> {
    return of(orgScoreResponse);
  }
}
