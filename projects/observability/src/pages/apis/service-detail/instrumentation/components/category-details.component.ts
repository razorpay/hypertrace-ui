import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ButtonRole, ButtonStyle } from '@hypertrace/components';
import { QoiTypeScore } from '../service-instrumentation.types';

@Component({
  styleUrls: ['./category-details.component.scss'],
  selector: 'ht-service-instrumentation-category-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-category-details">
      <ht-button label="← Back to overview" role="${ButtonRole.Primary}" display="${ButtonStyle.PlainText}"></ht-button>
      <h4>{{ this.categoryScore?.qoiType }}</h4>
      <p class="description">{{ this.categoryScore?.description }}</p>
    </div>
  `
})
export class CategoryDetailsComponent {
  @Input()
  public categoryScore: QoiTypeScore | undefined;
}
