import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReplayObservable, TimeRange, TimeRangeService } from '@hypertrace/common';

import { BreadcrumbsService } from '@hypertrace/components';
import { Observable } from 'rxjs';

@Component({
  styleUrls: ['./service-deployments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="service-deployments">
      <div *ngIf="serviceName$ | async as serviceName; else loading">
        <section class="deployments-list-section">
          <ht-service-deployments-list [serviceName]="serviceName" [timeRange]="this.currentTimeRange$ | async">
          </ht-service-deployments-list>
        </section>
        <p class="information-message">
          <span
            >Note: The criteria for deployments to be scraped from Spinnaker and shown here is having suffix
            "<code>prod</code>" in Spinnaker Application Name (different from pipeline name)</span
          >
        </p>
      </div>
      <ng-template #loading> Loading deployments... </ng-template>
    </main>
  `
})
export class ServiceDeploymentsComponent {
  public serviceName$: Observable<string> = this.breadcrumbsService.getLastBreadCrumbString();
  public currentTimeRange$: ReplayObservable<TimeRange>;
  public constructor(
    protected readonly breadcrumbsService: BreadcrumbsService,
    private readonly timeRangeService: TimeRangeService
  ) {
    this.currentTimeRange$ = this.timeRangeService.getTimeRangeAndChanges();
  }
}
