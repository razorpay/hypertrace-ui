/* tslint:disable:no-console */
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// TODO: fix import
/* tslint:disable:import-blacklist */
import { CustomDashboardService } from '../../../../observability/src/pages/custom-dashboards/custom-dashboard.service';

import {
  DashboardCreationData,
  DashboardStore,
  DashboardUpdateData,
  DashboardUpsertData,
  PersistedDashboard
} from './dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class DashboardRemoteStore implements DashboardStore {
  public constructor(private readonly customDashboardService: CustomDashboardService) {}
  public read(id: string): Observable<PersistedDashboard> {
    return this.customDashboardService.fetchDashboardConfigById(`/${id}.json`).pipe(
      catchError(() => throwError(`Provided ID does not exist: ${id}`)),
      map(
        /* tslint:disable:object-literal-shorthand */
        (data): PersistedDashboard => ({
          tags: [],
          content: data.json,
          name: data.location,
          version: 1,
          id
        })
      )
    );
  }
  public readAll(): Observable<PersistedDashboard> {
    return EMPTY;
  }
  public create(dashboard: DashboardCreationData): Observable<PersistedDashboard> {
    console.log(dashboard);

    return EMPTY;
  }
  public update(dashboard: DashboardUpdateData): Observable<PersistedDashboard> {
    console.log(dashboard);

    return EMPTY;
  }
  public delete(id: string): Observable<void> {
    console.log(id);

    return EMPTY;
  }
  public upsert(dashboard: DashboardUpsertData): Observable<PersistedDashboard> {
    console.log(dashboard);

    return EMPTY;
  }
}
