import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BreadcrumbsService } from '@hypertrace/components';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceInstrumentationService } from './service-instrumentation.service';
import { ServiceScoreResponse } from './service-instrumentation.types';

@Component({
  styleUrls: ['./service-instrumentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ServiceInstrumentationService],
  template: `
    <main class="service-instrumentation">
      <section class="overview">
        <div>{{ (this.serviceScoreSubject | async)?.serviceName }} progress circle and description</div>
        <ht-service-instrumentation-total-score
          [serviceScore]="this.serviceScoreSubject | async"
        ></ht-service-instrumentation-total-score>
        <div>org scores</div>
      </section>

      <section class="checks-container">
        <div>card1</div>
        <div>card2</div>
        <div>card3</div>
        <div>card4</div>
      </section>
    </main>
  `
})
export class ServiceInstrumentationComponent {
  public serviceScoreSubject: BehaviorSubject<ServiceScoreResponse | undefined> = new BehaviorSubject<
    ServiceScoreResponse | undefined
  >(undefined);

  public constructor(
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly serviceInstrumentationService: ServiceInstrumentationService
  ) {
    this.breadcrumbsService.breadcrumbs$
      .pipe(map(breadcrumbs => (breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1]?.label : undefined)))
      .subscribe(serviceName => {
        this.serviceInstrumentationService
          .getServiceScore(serviceName!)
          .subscribe(serviceScore => this.serviceScoreSubject.next(serviceScore));
      });
  }
}
