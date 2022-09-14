import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ServiceInstrumentationService } from '../service-instrumentation.service';

@Component({
  styleUrls: ['./progress-bar.component.scss'],
  selector: 'ht-service-instrumentation-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-progress-bar">
      <div class="score-info">
        <label>Score</label>
        <p class="score">
          {{ this.categoryScore | number: '1.0-0' }}
        </p>
      </div>

      <div>bar</div>
    </div>
  `
})
export class ProgressBarComponent {
  @Input()
  public categoryScore: number = 0;

  public scoreColor: string = '';

  public constructor(private readonly serviceInstrumentationService: ServiceInstrumentationService) {
    this.scoreColor = this.serviceInstrumentationService.getColorForScore(this.categoryScore).dark;
  }
}
