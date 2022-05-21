import { catchError } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { CustomDashboardService, DashboardListItem } from './custom-dashboard.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./custom-dashboards.component.scss'],
  template: `
    <div class="custom-dashboards">
      <div class="dashboard-list" *htLoadAsync="this.dashboards$ as dashboards">
        <ht-link class="dashboard" *ngFor="let dashboard of dashboards" [paramsOrUrl]="dashboard.link">
          <h4>{{ dashboard.display }}</h4>
        </ht-link>
      </div>
    </div>
  `
})
export class CustomDashboardListComponent implements OnInit {
  dashboards$: Observable<DashboardListItem[]> = of([]);
  constructor(private readonly customDashboardService: CustomDashboardService) {}
  ngOnInit(): void {
    this.dashboards$ = this.customDashboardService.fetchDashboards().pipe(catchError(() => EMPTY));
  }
}
