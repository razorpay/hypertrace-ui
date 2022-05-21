import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="custom-dashboard-detail">
      <ht-navigable-dashboard [customJson]="true" [navLocation]="this.dashboardId"> </ht-navigable-dashboard>
    </div>
  `
})
export class CustomDashboardComponent implements OnInit {
  public dashboardId!: string;
  public constructor(private readonly route: ActivatedRoute) {}
  public ngOnInit(): void {
    this.dashboardId = this.route.snapshot.paramMap.get('dashboard_id')!;
  }
}
