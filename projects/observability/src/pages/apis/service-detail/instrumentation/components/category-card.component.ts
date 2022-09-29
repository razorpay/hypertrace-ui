import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonRole, ButtonStyle } from '@hypertrace/components';
import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { HeuristicClassScoreInfo } from '../service-instrumentation.types';

@Component({
  styleUrls: ['./category-card.component.scss'],
  selector: 'ht-service-instrumentation-category-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-category-card" [style.border-top-color]="this.scoreColor">
      <h5 class="heading">{{ this.heuristicClassScore?.name }}</h5>
      <p class="checks-status">
        {{ this.getNoOfChecksPassing() }}/{{ this.heuristicClassScore?.heuristicScoreInfo.length }} checks passing
      </p>

      <ht-service-instrumentation-progress-bar
        [score]="this.heuristicClassScore?.score"
      ></ht-service-instrumentation-progress-bar>

      <ht-service-instrumentation-progress-bar
        *ngIf="this.orgCategoryScores"
        label="Razorpay Average"
        [score]="this.getOrgScoreForCategory()"
      ></ht-service-instrumentation-progress-bar>

      <p class="description">{{ this.heuristicClassScore?.description }}</p>

      <ht-button
        [label]="this.getButtonLabel(this.heuristicClassScore?.score ?? 90)"
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
  public heuristicClassScore: HeuristicClassScoreInfo | undefined;

  @Input()
  public orgCategoryScores: HeuristicClassScoreInfo[] | undefined;

  public scoreColor: string = '';

  public constructor(
    private readonly serviceInstrumentationService: ServiceInstrumentationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.scoreColor = this.serviceInstrumentationService.getColorForScore(this.heuristicClassScore?.score ?? 0).dark;
  }

  public getNoOfChecksPassing(): number {
    return (
      this.heuristicClassScore?.heuristicScoreInfo?.reduce(
        (accumulator, currentParam) => (currentParam.score >= 70 ? accumulator + 1 : accumulator),
        0
      ) ?? 0
    );
  }

  public getOrgScoreForCategory(): number {
    return this.orgCategoryScores?.find(score => score.name === this.heuristicClassScore?.name)?.score ?? 0;
  }

  public getButtonLabel(score: number): string {
    return score >= 90 ? 'See details' : 'Learn how to improve';
  }

  public onClickButton(): void {
    this.router.navigate([this.heuristicClassScore?.name.toLowerCase()], { relativeTo: this.route });
  }
}
