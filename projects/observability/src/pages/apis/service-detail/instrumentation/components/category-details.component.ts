import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { QoiTypeScore } from '../service-instrumentation.types';

@Component({
  selector: 'ht-service-instrumentation-category-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-category-details">
      <h5>Name of category</h5>
      <p>description of category</p>
    </div>
  `
})
export class CategoryDetailsComponent {
  @Input()
  public categoryScore: QoiTypeScore | undefined;
}
