import { Injectable } from '@angular/core';
import { RestClientService } from '@hypertrace/common';
import { Observable } from 'rxjs';
import { DashboardDefaultConfiguration } from './../../shared/dashboard/dashboard-wrapper/navigable-dashboard.module';

export interface DashboardListItem {
  link: string;
  display: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomDashboardService {
  public static readonly API_ID_PARAM_NAME: string = 'dashboard_id';

  public constructor(private readonly restClient: RestClientService) {}
  public fetchDashboards(): Observable<DashboardListItem[]> {
    return this.restClient.Get<DashboardListItem[]>('/list.json');
  }
  public fetchDashboard(dashboardId: string): Observable<DashboardDefaultConfiguration> {
    return this.restClient.Get<DashboardDefaultConfiguration>(dashboardId);
  }
}
