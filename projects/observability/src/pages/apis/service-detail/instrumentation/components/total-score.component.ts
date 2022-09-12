import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ServiceInstrumentationService } from '../service-instrumentation.service';

@Component({
  styleUrls: ['./total-score.component.scss'],
  selector: 'ht-service-instrumentation-total-score',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-total-score">
      <ht-progress-circle [percent]="serviceScore"></ht-progress-circle>

      <div>
        <h4 class="heading">
          {{ this.getScoreLabel() }}
        </h4>

        <p class="description">
          {{ this.getDescriptionForScore() }}
        </p>

        <div class="legend">
          <div class="dot">
            <span [style.background-color]="'#dc3d43'"></span>
            <label>0-49</label>
          </div>

          <div class="dot">
            <span [style.background-color]="'#ffa01c'"></span>
            <label>50-69</label>
          </div>

          <div class="dot">
            <span [style.background-color]="'#3d9a50'"></span>
            <label>70-100</label>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TotalScoreComponent {
  @Input()
  public serviceScore: number = 0;

  public constructor(private readonly serviceInstrumentationService: ServiceInstrumentationService) {}

  public getScoreLabel(): string {
    return this.serviceInstrumentationService.getLabelForScore(this.serviceScore);
  }

  public getDescriptionForScore(): string {
    if (this.serviceScore < 50) {
      return 'Attention is needed to improve the instrumentation of this service so you can start gaining valuable insights from Hypertrace.';
    }

    if (this.serviceScore < 70) {
      return 'There is considerable scope for improvement. Please see the sections below to learn how to improve the instrumentation of this service.';
    }

    if (this.serviceScore < 90) {
      return 'This service has good instrumentation, but you can still make improvements to gain more valuable insights from Hypertrace.';
    }

    return 'Great job! This service has been instrumented using best practices.';
  }
}
