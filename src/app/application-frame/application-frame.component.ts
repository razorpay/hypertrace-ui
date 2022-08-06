import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconType } from '@hypertrace/assets-library';
import { LayoutChangeService, SubscriptionLifecycle, TimeRange, TimeRangeService } from '@hypertrace/common';
import { IconSize } from '@hypertrace/components';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AddUserService } from '../shared/add-user/add-user.service';
import { UserTelemetryOrchestrationService } from '../shared/telemetry/user-telemetry-orchestration.service';

@Component({
  selector: 'ht-application-frame',
  styleUrls: ['./application-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LayoutChangeService, AddUserService, SubscriptionLifecycle], // Provided as root layout
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
    private readonly addUserService: AddUserService
  ) {
    this.timeRangeHasInit$ = this.timeRangeService.getTimeRangeAndChanges().pipe(take(1));
  }

  public ngOnInit(): void {
    this.addUserService.addUser().subscribe();
    this.userTelemetryOrchestrationService.initialize();
  }
}
