import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="custom-dashboard-detail">
      <ht-navigable-dashboard [customJson]="true" [navLocation]="this.dashboard_id"> </ht-navigable-dashboard>
    </div>
  `
})
export class CustomDashboardComponent implements OnInit {
  dashboard_id!: string;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.dashboard_id = this.route.snapshot.paramMap.get('dashboard_id')!;
  }
}
