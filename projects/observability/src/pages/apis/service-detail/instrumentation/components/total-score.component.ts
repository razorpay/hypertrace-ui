import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ServiceInstrumentationService } from '../service-instrumentation.service';

@Component({
  styleUrls: ['./total-score.component.scss'],
  selector: 'ht-service-instrumentation-total-score',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-total-score">
      <ht-progress-circle
        [percent]="serviceScore"
        [colorLight]="scoreColors?.light"
        [colorDark]="scoreColors?.dark"
      ></ht-progress-circle>

      <div class="info-container">
        <h4 class="heading">{{ this.getScoreLabel() }}</h4>

        <p class="description">
          {{ this.getDescriptionForScore() }}
        </p>

        <div class="legend">
          <div class="dot" *ngFor="let legendColor of this.legendColors; index as i">
            <span [style.background-color]="legendColor"></span>
            <label>{{ this.legendLabels[i] }}</label>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TotalScoreComponent implements OnChanges {
  @Input()
  public serviceScore: number = 0;

  public scoreColors: { light: string; dark: string } | undefined;

  public legendColors: string[] = ['#dc3d43', '#ffa01c', '#3d9a50'];
  public legendLabels: string[] = ['0-49', '50-69', '70-100'];

  public constructor(private readonly serviceInstrumentationService: ServiceInstrumentationService) {}

  public ngOnChanges(): void {
    this.scoreColors = this.serviceInstrumentationService.getColorForScore(this.serviceScore);
  }

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
