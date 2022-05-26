import { Injectable } from '@angular/core';
import { RestClientService } from '@hypertrace/common';
import { Dashboard } from '@hypertrace/hyperdash';
import { Observable, of, Subscription } from 'rxjs';
import { DashboardDefaultConfiguration } from './../../shared/dashboard/dashboard-wrapper/navigable-dashboard.module';
import { GraphQlFilterDataSourceModel } from './../../shared/dashboard/data/graphql/filter/graphql-filter-data-source.model';
import { GraphQlFilter } from './../../shared/graphql/model/schema/filter/graphql-filter';

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
    return this.restClient.get<DashboardListItem[]>('/custom-dashboards-list.json');
  }
  public fetchDashboardConfigById(dashboardId: string): Observable<DashboardDefaultConfiguration> {
    return this.restClient.get<DashboardDefaultConfiguration>(dashboardId);
  }

  public applyFiltersToDashboard(dashboard: Dashboard, filters: GraphQlFilter[] = []): Subscription {
    const rootDataSource = dashboard.getRootDataSource<GraphQlFilterDataSourceModel>();
    rootDataSource && rootDataSource.clearFilters().addFilters(...filters);

    return of(dashboard.refresh()).subscribe();
  }
}
