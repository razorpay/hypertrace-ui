import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '@hypertrace/common';

import { ButtonRole, ButtonStyle } from '@hypertrace/components';
import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { QoiTypeScore } from '../service-instrumentation.types';

@Component({
  styleUrls: ['./category-card.component.scss'],
  selector: 'ht-service-instrumentation-category-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-category-card" [style.border-top-color]="this.scoreColor">
      <h5 class="heading">{{ this.categoryScore?.qoiType }}</h5>
      <p class="checks-status">
        {{ this.noOfChecksPassing() }}/{{ this.categoryScore?.qoiParamScores.length }} checks passing
      </p>

      <ht-service-instrumentation-progress-bar
        [score]="this.categoryScore?.score"
      ></ht-service-instrumentation-progress-bar>

      <ht-service-instrumentation-progress-bar
        label="Razorpay Average"
        [score]="this.getOrgScoreForCategory()"
      ></ht-service-instrumentation-progress-bar>

      <p class="description">{{ categoryScore?.description }}</p>

      <ht-button
        [label]="this.getButtonLabel()"
        role="${ButtonRole.Tertiary}"
        display="${ButtonStyle.Bordered}"
        width="100%"
        (click)="this.onClickButton()"
      ></ht-button>
    </div>
  `
})
export class CategoryCardComponent implements OnInit {
  @Input()
  public categoryScore: QoiTypeScore | undefined;

  @Input()
  public orgCategoryScores: QoiTypeScore[] | undefined;

  public scoreColor: string = '';

  public constructor(
    private readonly serviceInstrumentationService: ServiceInstrumentationService,
    private readonly navigationService: NavigationService
  ) {}

  public ngOnInit(): void {
    this.scoreColor = this.serviceInstrumentationService.getColorForScore(this.categoryScore?.score ?? 0).dark;
  }

  public noOfChecksPassing(): number {
    return (
      this.categoryScore?.qoiParamScores?.reduce(
        (accumulator, currentParam) => (currentParam.score >= 70 ? accumulator + 1 : accumulator),
        0
      ) ?? 0
    );
  }

  public getOrgScoreForCategory(): number {
    return this.orgCategoryScores?.find(score => score.qoiType === this.categoryScore?.qoiType)?.score ?? 0;
  }

  public getButtonLabel(): string {
    return Number(this.categoryScore?.score) >= 90 ? 'See details' : 'Learn how to improve';
  }

  public onClickButton(): void {
    this.navigationService.addQueryParametersToUrl({ category: 'quality' });
  }
}
