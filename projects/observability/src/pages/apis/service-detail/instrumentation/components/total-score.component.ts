import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ServiceScoreResponse } from '../service-instrumentation.types';

@Component({
  selector: 'ht-service-instrumentation-total-score',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ this.serviceScore?.serviceName }}
    <div>progress circle and description</div> `
})
export class TotalScoreComponent {
  @Input()
  public serviceScore!: ServiceScoreResponse;
}
