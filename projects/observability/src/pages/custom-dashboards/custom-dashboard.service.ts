import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPreferenceService } from '@hypertrace/common';
import { PageEvent } from '@hypertrace/components';
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

export interface CustomDashboardListResponse {
  error: object;
  payload: CustomDashboardPayload[];
  totalRecords: number;
  success: boolean;
}
interface CustomDashboardResponse {
  error: object;
  payload: CustomDashboardPayload;
  success: boolean;
}
export interface CustomDashboardPayload {
  CreatedAt: Date;
  Data: DashboardListItem;
  DeletedAt: Date;
  Id: string;
  OwnerID: number;
  UpdatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CustomDashboardService {
  public static readonly API_ID_PARAM_NAME: string = 'dashboard_id';
  public readonly BASE_URL: string = '/v1/dashboard';
  public constructor(private readonly userPreferenceService: UserPreferenceService) {}
  public fetchDashboards(searchText: string, pagination?: PageEvent): Observable<CustomDashboardListResponse> {
    let queryParams = new HttpParams();
    if (pagination) {
      queryParams = queryParams.append('page', pagination.pageIndex);
      queryParams = queryParams.append('size', pagination.pageSize);
    }
    queryParams = queryParams.append('search', searchText);

    return this.userPreferenceService.get<CustomDashboardListResponse>(`${this.BASE_URL}/global`, {
      params: queryParams
    });
  }
  public fetchDashboardConfigById(dashboardId: string): Observable<CustomDashboardResponse> {
    return this.userPreferenceService.get<CustomDashboardResponse>(`${this.BASE_URL}/${dashboardId}`);
  }
  public createDashboard(dashboard: DashboardListItem): Observable<DashboardListItem> {
    return this.userPreferenceService.post<DashboardListItem>(`${this.BASE_URL}/save`, {
      body: dashboard
    });
  }
  public updateDashboard(dashboardId: string, dashboard: DashboardListItem): Observable<DashboardListItem> {
    return this.userPreferenceService.put<DashboardListItem>(`${this.BASE_URL}/${dashboardId}`, {
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
