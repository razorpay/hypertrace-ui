import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomDashboardService, DashboardListItem } from './custom-dashboard.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./custom-dashboards.component.scss'],
  template: `
    <div class="custom-dashboards">
      <div class="dashboard-list" *htLoadAsync="this.dashboards$ as dashboards">
        <ht-link class="dashboard" *ngFor="let dashboard of dashboards.data" [paramsOrUrl]="dashboard.link">
          <h4>{{ dashboard.display }}</h4>
        </ht-link>
      </div>
    </div>
  `
})
export class CustomDashboardListComponent implements OnInit {
  public dashboards$: Observable<DashboardListItem[]> = of([]);
  public constructor(private readonly customDashboardService: CustomDashboardService) {}
  public ngOnInit(): void {
    this.dashboards$ = this.customDashboardService.fetchDashboards();
  }
}
