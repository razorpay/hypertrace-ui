import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// Import { v5 as uuidv5 } from 'uuid';
import { DashboardRemoteStore } from './store/dashboard-remote-store';
import {
  DashboardCreationData,
  DashboardStore,
  DashboardUpdateData,
  DashboardUpsertData,
  PersistedDashboard
} from './store/dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class DashboardPersistenceService {
  // Private static readonly HYPERTRACE_LOCATION_NAMESPACE: string = '7f12784d-0bd1-4b0f-94da-cb8aa3b7fc9e';

  private readonly defaultLocations: Map<string, PersistedDashboard> = new Map();

  public constructor(
    @Inject(DashboardRemoteStore)
    private readonly dashboardStore: DashboardStore
  ) {}

  public getById(id: string): Observable<PersistedDashboard> {
    // TODO do we support tag-based searching? Name based?
    return this.dashboardStore.read(id);
  }

  public getAll(): Observable<PersistedDashboard> {
    return this.dashboardStore.readAll();
  }

  public create(dashboard: DashboardCreationData): Observable<PersistedDashboard> {
    return this.dashboardStore.create(dashboard);
  }

  public update(dashboard: DashboardUpdateData): Observable<PersistedDashboard> {
    return this.dashboardStore.update(dashboard);
  }

  public delete(id: string): Observable<void> {
    return this.dashboardStore.delete(id);
  }

  public getForLocation(locationKey: string): Observable<PersistedDashboard> {
    return this.getById(this.getLocationId(locationKey)).pipe(
      catchError(() => this.getDefaultForLocation(locationKey))
    );
  }

  public setDefaultForLocation(locationKey: string, dashboard: DashboardCreationData): void {
    this.defaultLocations.set(locationKey, {
      ...dashboard,
      id: this.getLocationId(locationKey),
      version: 1
    });
  }

  public setForLocation(locationKey: string, dashboard: DashboardUpsertData): Observable<PersistedDashboard> {
    /* Not sure if this should be a different method, but a location dashboard doesn't know if
     it has been persisted or not */
    return this.dashboardStore.upsert({
      ...dashboard,
      id: this.getLocationId(locationKey)
    });
  }

  public getDefaultForLocation(locationKey: string): Observable<PersistedDashboard> {
    const dashboardDefault = this.defaultLocations.get(locationKey);

    return dashboardDefault === undefined
      ? throwError(`No default defined for location: ${locationKey}`)
      : of(dashboardDefault);
  }

  private getLocationId(locationKey: string): string {
    // Return uuidv5(locationKey, DashboardPersistenceService.HYPERTRACE_LOCATION_NAMESPACE); TODO: Discuss
    return locationKey;
  }
}
