import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IconType } from '@hypertrace/assets-library';
import { ButtonRole, ButtonStyle } from '@hypertrace/components';
import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { HeuristicClassScoreInfo } from '../service-instrumentation.types';

@Component({
  styleUrls: ['./instrumentation-details.component.scss'],
  selector: 'ht-service-instrumentation-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="service-instrumentation-details">
      <div class="button-container">
        <ht-button
          label="← Back to overview"
          role="${ButtonRole.Primary}"
          display="${ButtonStyle.PlainText}"
          (click)="this.onClickBack()"
        ></ht-button>
      </div>
      <h4>{{ this.heuristicClassScore?.name }}</h4>
      <p class="description">{{ this.heuristicClassScore?.description }}</p>

      <mat-accordion class="heuristics">
        <mat-expansion-panel *ngFor="let heuristicScore of this.heuristicClassScore?.heuristicScoreInfo">
          <mat-expansion-panel-header>
            <mat-panel-title class="header-title">
              <ht-icon
                class="status-icon"
                [icon]="this.getHeaderIcon(heuristicScore.score)"
                [color]="this.getIconColor(heuristicScore.score)"
              ></ht-icon
              >{{ heuristicScore.name }}
            </mat-panel-title>
            <mat-panel-description> This is a summary of the content </mat-panel-description>
          </mat-expansion-panel-header>
          <p>This is the primary content of the panel.</p>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `
})
export class InstrumentationDetailsComponent {
  public heuristicClassScore: HeuristicClassScoreInfo | undefined;

  public constructor(
    private readonly serviceInstrumentationService: ServiceInstrumentationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.route.url.subscribe(url => {
      this.serviceInstrumentationService.serviceScoreSubject.subscribe(serviceScore => {
        this.heuristicClassScore = serviceScore?.heuristicClassScoreInfo.find(
          category => category.name.toLowerCase() === url[0].path
        );
      });
    });
  }

  public onClickBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public getHeaderIcon(score: number): string {
    if (score < 50) {
      return IconType.Close;
    }

    if (score < 70) {
      return IconType.Warning;
    }

    return IconType.Checkmark;
  }

  public getIconColor(score: number): string {
    return this.serviceInstrumentationService.getColorForScore(score).dark;
  }
}
