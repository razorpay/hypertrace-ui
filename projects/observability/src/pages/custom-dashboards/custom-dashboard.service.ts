import { Injectable } from '@angular/core';
import { RestClientService } from '@hypertrace/common';
import { Dashboard } from '@hypertrace/hyperdash';
import { Observable, of, Subscription } from 'rxjs';
import { GraphQlFilterDataSourceModel } from './../../shared/dashboard/data/graphql/filter/graphql-filter-data-source.model';
import { GraphQlFilter } from './../../shared/graphql/model/schema/filter/graphql-filter';
import { PanelData } from './custom-dashboard-store.service';

export interface DashboardListItem {
  id: string;
  name: string;
  panels: PanelData[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomDashboardService {
  public static readonly API_ID_PARAM_NAME: string = 'dashboard_id';

  public constructor(private readonly restClient: RestClientService) {}
  public fetchDashboards(searchText: string): Observable<DashboardListItem[]> {
    return this.restClient.get<DashboardListItem[]>(`custom-dashboards.json?searchText=${searchText}`);
  }
  public fetchDashboardConfigById(dashboardId: string): Observable<DashboardListItem> {
    return this.restClient.get<DashboardListItem>(dashboardId);
  }
  public createDashboard(dashboard: DashboardListItem): Observable<DashboardListItem> {
    return this.restClient.post<DashboardListItem>('', {
      body: dashboard
    });
  }
  public updateDashboard(dashboardId: string, dashboard: DashboardListItem): Observable<DashboardListItem> {
    return this.restClient.put<DashboardListItem>(dashboardId, {
      body: dashboard
    });
  }
  public applyFiltersToDashboard(dashboard: Dashboard, filters: GraphQlFilter[] = []): Subscription {
    const rootDataSource = dashboard.getRootDataSource<GraphQlFilterDataSourceModel>();
    rootDataSource && rootDataSource.clearFilters().addFilters(...filters);

    return of(dashboard.refresh()).subscribe();
  }
  public convertToSlug(text: string): string {
    const slug = text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    return `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}
