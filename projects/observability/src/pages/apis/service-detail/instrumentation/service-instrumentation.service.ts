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
}
