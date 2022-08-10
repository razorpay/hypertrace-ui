import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconType } from '@hypertrace/assets-library';
import {
  LayoutChangeService,
  SubscriptionLifecycle,
  TimeRange,
  TimeRangeService,
  UserPreferenceService
} from '@hypertrace/common';
import { IconSize } from '@hypertrace/components';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserTelemetryOrchestrationService } from '../shared/telemetry/user-telemetry-orchestration.service';

@Component({
  selector: 'ht-application-frame',
  styleUrls: ['./application-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LayoutChangeService, SubscriptionLifecycle], // Provided as root layout
  template: `
    <ht-application-header>
      <div class="ht-logo" logo>
        <ht-icon icon="${IconType.Hypertrace}" size="${IconSize.Inherit}"></ht-icon>
      </div>
    </ht-application-header>
    <div class="app-body">
      <ht-navigation class="left-nav"></ht-navigation>
      <div class="app-content" *ngIf="this.timeRangeHasInit$ | async">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class ApplicationFrameComponent implements OnInit {
  public readonly timeRangeHasInit$: Observable<TimeRange>;

  public constructor(
    private readonly userTelemetryOrchestrationService: UserTelemetryOrchestrationService,
    private readonly timeRangeService: TimeRangeService,
    private readonly userPreferenceService: UserPreferenceService
  ) {
    this.timeRangeHasInit$ = this.timeRangeService.getTimeRangeAndChanges().pipe(take(1));
  }

  public ngOnInit(): void {
    /**
     * We call the /user/add endpoint of the Hypertrace User Service once on
     * every application load. This adds the user to the service if not present
     * already. More details: https://razorpay.slack.com/archives/CU5GKS8MQ/p1659328334493179?thread_ts=1659310225.849849&cid=CU5GKS8MQ
     */
    this.userPreferenceService.get<{ success: boolean }>('/v1/user/add').subscribe();
    this.userTelemetryOrchestrationService.initialize();
  }
}
