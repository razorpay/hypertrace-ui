import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ServiceScoreResponse } from '../service-instrumentation.types';

@Component({
  selector: 'ht-service-instrumentation-total-score',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ht-service-instrumentation-progress-circle
      [percent]="serviceScore?.aggregatedWeightedScore"
    ></ht-service-instrumentation-progress-circle>
    <div>score description</div>
  `
})
export class TotalScoreComponent {
  @Input()
  public serviceScore!: ServiceScoreResponse;
}
