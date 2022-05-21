import { CustomDashboardService } from './../../../../observability/src/pages/custom-dashboards/custom-dashboard.service';
import { Injectable } from '@angular/core';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  constructor(private customDashboardService: CustomDashboardService) {}
  public read(id: string): Observable<PersistedDashboard> {
    return this.customDashboardService.fetchDashboard(`/${id}.json`).pipe(
      catchError(() => {
        console.log('Failed');
        return throwError(`Provided ID does not exist: ${id}`);
      }),
      map(data => {
        return {
          tags: [],
          content: data.json,
          name: data.location,
          version: 1,
          id
        } as PersistedDashboard;
      })
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
