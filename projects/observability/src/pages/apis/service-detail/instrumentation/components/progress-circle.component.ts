import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ht-service-instrumentation-progress-circle',
  changeDetection: ChangeDetectionStrategy.Default, // tslint:disable-line: prefer-on-push-component-change-detection
  template: `
    <div class="service-instrumentation-progress-circle">
      <circle-progress
        [percent]="this.percent"
        [radius]="56"
        [innerStrokeWidth]="4"
        [outerStrokeWidth]="8"
        [space]="-6"
        [innerStrokeColor]="this.getColor().inner"
        [outerStrokeColor]="this.getColor().outer"
        [titleFontSize]="30"
        [animation]="false"
        [showUnits]="false"
        [showSubtitle]="false"
      ></circle-progress>
    </div>
  `
})
export class ProgressCircleComponent {
  @Input()
  public percent: number = 0;

  public getColor(): { inner: string; outer: string } {
    // Shades taken from Radix Colors
    if (this.percent < 50) {
      return {
        inner: '#ffe5e5', // Red4
        outer: '#dc3d43' // Red10
      };
    }

    if (this.percent < 70) {
      return {
        inner: '#ffecbc', // Amber4
        outer: '#ffa01c' // Amber10
      };
    }

    return {
      inner: '#e4f7c7', // Lime4
      outer: '#99d52a' // Lime10
    };
  }
}
