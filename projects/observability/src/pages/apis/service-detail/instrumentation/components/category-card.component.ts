import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { QoiTypeScore } from '../service-instrumentation.types';

@Component({
  styleUrls: ['./category-card.component.scss'],
  selector: 'ht-service-instrumentation-category-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-category-card" [style.border-top-color]="this.scoreColor">
      <h5 class="heading">{{ this.categoryScore?.qoiType }}</h5>
      <p class="checks-status">0/6 checks passing</p>

      <ht-service-instrumentation-progress-bar
        [categoryScore]="this.categoryScore?.score"
      ></ht-service-instrumentation-progress-bar>
    </div>
  `
})
export class CategoryCardComponent implements OnInit {
  @Input()
  public categoryScore: QoiTypeScore | undefined;

  public scoreColor: string = '';

  public constructor(private readonly serviceInstrumentationService: ServiceInstrumentationService) {}

  public ngOnInit(): void {
    this.scoreColor = this.serviceInstrumentationService.getColorForScore(this.categoryScore?.score ?? 0).dark;
  }
}
