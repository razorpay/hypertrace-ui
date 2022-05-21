import { DashboardDefaultConfiguration } from './../../shared/dashboard/dashboard-wrapper/navigable-dashboard.module';
import { RestClientService } from '@hypertrace/common';
import { Injectable } from '@angular/core';

export interface DashboardListItem {
  link: string;
  display: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomDashboardService {
  public static readonly API_ID_PARAM_NAME: string = 'dashboard_id';

  constructor(private readonly restClient: RestClientService) {}
  public fetchDashboards() {
    return this.restClient.Get<DashboardListItem[]>('/list.json');
  }
  public fetchDashboard(dashboard_id: string) {
    return this.restClient.Get<DashboardDefaultConfiguration>(dashboard_id);
  }
}
