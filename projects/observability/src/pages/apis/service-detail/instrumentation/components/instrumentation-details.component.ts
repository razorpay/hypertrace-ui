import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IconType } from '@hypertrace/assets-library';
import { ButtonRole, ButtonStyle } from '@hypertrace/components';
import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { QoiTypeScore } from '../service-instrumentation.types';

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
      <h4>{{ this.categoryScore?.qoiType }}</h4>
      <p class="description">{{ this.categoryScore?.description }}</p>

      <mat-accordion class="heuristics">
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <ht-icon class="status-icon" icon="${IconType.Checkmark}"></ht-icon> This is the expansion title
            </mat-panel-title>
            <mat-panel-description> This is a summary of the content </mat-panel-description>
          </mat-expansion-panel-header>
          <p>This is the primary content of the panel.</p>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <ht-icon class="status-icon" icon="${IconType.Checkmark}"></ht-icon> This is the expansion title
            </mat-panel-title>
            <mat-panel-description> This is a summary of the content </mat-panel-description>
          </mat-expansion-panel-header>
          <p>This is the primary content of the panel.</p>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <ht-icon class="status-icon" icon="${IconType.Checkmark}"></ht-icon> This is the expansion title
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
  public categoryScore: QoiTypeScore | undefined;

  public constructor(
    private readonly serviceInstrumentationService: ServiceInstrumentationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.route.url.subscribe(url => {
      this.serviceInstrumentationService.serviceScoreSubject.subscribe(serviceScore => {
        this.categoryScore = serviceScore?.qoiTypeScores.find(
          category => category.qoiType.toLowerCase() === url[0].path
        );
      });
    });
  }

  public onClickBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
