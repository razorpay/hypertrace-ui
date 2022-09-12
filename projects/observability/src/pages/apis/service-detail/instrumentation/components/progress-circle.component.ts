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
            stroke: this.colorLight
          }"
        ></circle>
        <circle
          class="progress-circle-prog"
          cx="80"
          cy="80"
          r="58"
          [ngStyle]="{
            stroke: this.colorDark,
            'stroke-dasharray': this.getDashLength()
          }"
        ></circle>
      </svg>
      <div class="progress-text">{{ this.percent | number: '1.0-0' }}</div>
    </div>
  `
})
export class ProgressCircleComponent {
  @Input()
  public percent: number = 0;

  @Input()
  public colorLight: string = '#e1f0ff';

  @Input()
  public colorDark: string = '#0081f1';

  public getDashLength(): string {
    const dashLength = (364 * this.percent) / 100;

    return `${dashLength} 999`;
  }
}
