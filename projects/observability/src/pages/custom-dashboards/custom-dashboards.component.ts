import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationParamsType, NavigationService } from '@hypertrace/common';
import {
  ButtonRole,
  ButtonStyle,
  CoreTableCellRendererType,
  TableColumnConfig,
  TableDataResponse,
  TableDataSource,
  TableMode,
  TableRow
} from '@hypertrace/components';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomDashboardService, DashboardListItem } from './custom-dashboard.service';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./custom-dashboards.component.scss'],
  template: `
    <div class="custom-dashboards">
      <div class="title">
        <h2>Custom Dashboards</h2>
        <ht-link [paramsOrUrl]="'create'" class="create-dashboard-button">
          <ht-button role="${ButtonRole.Primary}" display="${ButtonStyle.Solid}" label="Create Dashboard"> </ht-button>
        </ht-link>
      </div>
      <ht-search-box
        class="search-box"
        placeholder="Search"
        [debounceTime]="400"
        (valueChange)="this.onSearchChange($event)"
      ></ht-search-box>
      <div class="dashboard-table" *htLoadAsync="this.dashboards$ as dashboards">
        <ht-table
          [columnConfigs]="this.columnConfigs"
          [data]="this.dataSource"
          [pageable]="false"
          [resizable]="false"
          mode=${TableMode.Flat}
        ></ht-table>
      </div>
    </div>
  `
})
export class CustomDashboardListComponent {
  public dashboards$: Observable<DashboardListItem[]> = of([]);
  public dataSource?: TableDataSource<CustomDashboardTableRow>;
  public searchText: string = '';

  public columnConfigs: TableColumnConfig[] = [
    {
      id: 'name',
      name: 'name',
      title: 'Name',
      display: CoreTableCellRendererType.Text,
      visible: true,
      width: '100%',
      sortable: false,
      filterable: false,
      onClick: (row: CustomDashboardTableRow, _column) => this.navigateToDashboard(row.id)
    },
    {
      id: 'createdBy',
      name: 'created_by',
      title: 'Author',
      display: CoreTableCellRendererType.Text,
      visible: true,
      width: '100%',
      sortable: false,
      filterable: false
    }
  ];

  public constructor(
    private readonly customDashboardService: CustomDashboardService,
    protected readonly navigationService: NavigationService
  ) {
    this.setupDataSource();
  }

  private setupDataSource(): void {
    this.dashboards$ = this.customDashboardService.fetchDashboards(this.searchText).pipe(
      tap(dashboards => {
        this.dataSource = {
          getData: (): Observable<TableDataResponse<CustomDashboardTableRow>> =>
            of({
              data: dashboards.map((dashboard: DashboardListItem) => ({
                ...dashboard,
                createdBy: 'Demo' // TODO Remove later
                // timestamp: this.dateCoercer.coerce(logEvent.timestamp),
                // baseTimestamp: this.dateCoercer.coerce(logEvent.spanStartTime)
              })),
              totalCount: dashboards.length
            }),
          getScope: () => undefined
        };
      })
    );
  }
  private navigateToDashboard(id: string): void {
    this.navigationService.navigate({
      navType: NavigationParamsType.InApp,
      path: [`/custom-dashboards/${id}`]
    });
  }
  public navigateToCreateDashboard(): void {
    this.navigationService.navigateWithinApp(['/create']);
  }
  public onSearchChange(searchText: string): void {
    this.searchText = searchText;
    this.setupDataSource();
  }
}

interface CustomDashboardTableRow extends TableRow {
  id: string;
  name: string;
  createdBy?: string;
  createdAt?: string;
}
