/* tslint:disable:no-console */
import { Injectable } from '@angular/core';
import { CustomDashboardService } from '@hypertrace/observability';
import { EMPTY, Observable, throwError } from 'rxjs';
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
  public constructor(private readonly customDashboardService: CustomDashboardService) {}
  public read(id: string): Observable<PersistedDashboard> {
    return this.customDashboardService.fetchDashboard(`/${id}.json`).pipe(
      catchError(() => {
        console.log('Failed');

        return throwError(`Provided ID does not exist: ${id}`);
      }),
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
