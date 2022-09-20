import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ButtonRole, ButtonStyle } from '@hypertrace/components';
import { BehaviorSubject } from 'rxjs';
import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { QoiTypeScore } from '../service-instrumentation.types';

@Component({
  styleUrls: ['./instrumentation-details.component.scss'],
  selector: 'ht-service-instrumentation-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-category-details">
      <ht-button label="← Back to overview" role="${ButtonRole.Primary}" display="${ButtonStyle.PlainText}"></ht-button>
      <h4>{{ (this.categoryScoreSubject | async)?.qoiType }}</h4>
      <p class="description">{{ (this.categoryScoreSubject | async)?.description }}</p>
    </div>
  `
})
export class InstrumentationDetailsComponent {
  public categoryScoreSubject: BehaviorSubject<QoiTypeScore | undefined> = new BehaviorSubject<
    QoiTypeScore | undefined
  >(undefined);

  public constructor(
    private readonly serviceInstrumentationService: ServiceInstrumentationService,
    private readonly route: ActivatedRoute
  ) {
    this.route.url.subscribe(url => {
      this.serviceInstrumentationService.serviceScoreSubject.subscribe(serviceScore => {
        this.categoryScoreSubject.next(
          serviceScore?.qoiTypeScores.find(category => category.qoiType.toLowerCase() === url[0].path)
        );
      });
    });
  }
}
