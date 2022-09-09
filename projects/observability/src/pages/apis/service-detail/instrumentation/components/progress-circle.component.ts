import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  styleUrls: ['./progress-circle.component.scss'],
  selector: 'ht-progress-circle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ht-progress-circle">
      <svg class="progress-circle" width="200px" height="200px" xmlns="http://www.w3.org/2000/svg">
        <circle
          class="progress-circle-back"
          cx="80"
          cy="80"
          r="58"
          [ngStyle]="{
            stroke: this.getColor().inner
          }"
        ></circle>
        <circle
          class="progress-circle-prog"
          cx="80"
          cy="80"
          r="58"
          [ngStyle]="{
            stroke: this.getColor().outer,
            'stroke-dasharray': this.getDashLength()
          }"
        ></circle>
      </svg>
      <div class="progress-text">{{ this.getRoundedPercent() }}</div>
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
      inner: '#dff3df', // Grass4
      outer: '#3d9a50' // Grass10
    };
  }

  public getDashLength(): string {
    const dashLength = (364 * this.percent) / 100;

    return `${dashLength} 999`;
  }

  public getRoundedPercent(): number {
    return Math.round(this.percent);
  }
}
