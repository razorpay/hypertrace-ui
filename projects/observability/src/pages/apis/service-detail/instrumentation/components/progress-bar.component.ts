import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ServiceInstrumentationService } from '../service-instrumentation.service';

@Component({
  styleUrls: ['./progress-bar.component.scss'],
  selector: 'ht-service-instrumentation-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-progress-bar">
      <div class="score-info">
        <label>{{ this.label }}</label>
        <p class="score">
          {{ this.score | number: '1.0-0' }}
        </p>
      </div>

      <div class="progress">
        <span [style.width]="this.score + '%'" [style.background-color]="this.scoreColor"></span>
      </div>
    </div>
  `
})
export class ProgressBarComponent implements OnInit {
  @Input()
  public score: number = 0;

  @Input()
  public label: string = 'Score';

  public scoreColor: string = '';

  public constructor(private readonly serviceInstrumentationService: ServiceInstrumentationService) {}

  public ngOnInit(): void {
    this.scoreColor = this.serviceInstrumentationService.getColorForScore(this.score).dark;
  }
}
