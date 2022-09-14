import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
            'stroke-dasharray': this.dashLengthSubject | async
          }"
        ></circle>
      </svg>
      <div class="progress-text">{{ this.percent | number: '1.0-0' }}</div>
    </div>
  `
})
export class ProgressCircleComponent implements OnInit {
  @Input()
  public percent: number = 0;

  @Input()
  public colorLight: string = '#e1f0ff';

  @Input()
  public colorDark: string = '#0081f1';

  public dashLengthSubject: BehaviorSubject<string> = new BehaviorSubject<string>('0 999');

  public ngOnInit(): void {
    setTimeout(() => {
      this.getDashLength();
    }, 0);
  }

  public getDashLength(): void {
    const perimeter = 2 * Math.PI * 58;
    const dashLength = perimeter * (this.percent / 100);
    this.dashLengthSubject.next(`${dashLength} 999`);
  }
}
